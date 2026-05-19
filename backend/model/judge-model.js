const Admin = require("../schema/admin-schema");
const Registration = require("../schema/registration-schema");
const bcrypt = require("bcryptjs");
const { SCORING, normalizeAndValidateScore } = require("../constants/scoring");

// ✅ Create Judge (Admin Only)
const createJudge = async (data) => {
    try {
        const judgeCount = await Admin.countDocuments({ role: "judge" });

        if (judgeCount >= SCORING.MAX_JUDGES) {
            return { status: 400, message: `Maximum limit of ${SCORING.MAX_JUDGES} judges reached` };
        }

        const exist = await Admin.findOne({ email: data.email });

        if (exist) {
            return { status: 409, message: "Judge/Admin already exists with this email" };
        }

        const hashed = await bcrypt.hash(data.password, 10);

        const judge = await new Admin({
            ...data,
            password: hashed,
            role: "judge"
        }).save();

        return {
            status: 201,
            message: "Judge created successfully",
            data: {
                id: judge._id,
                name: judge.name,
                email: judge.email,
                role: judge.role
            }
        };

    } catch (err) {
        return { status: 500, message: err.message };
    }
};

// ✅ Get All Judges
const getAllJudges = async () => {
    try {
        const judges = await Admin.find({ role: "judge" }).select("-password");
        return { status: 200, data: judges };
    } catch (err) {
        return { status: 500, message: err.message };
    }
};

// ✅ Update Judge
const updateJudge = async (id, data) => {
    try {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        const judge = await Admin.findByIdAndUpdate(id, data, { new: true }).select("-password");

        if (!judge) {
            return { status: 404, message: "Judge not found" };
        }

        return { status: 200, message: "Judge updated successfully", data: judge };
    } catch (err) {
        return { status: 500, message: err.message };
    }
};

// ✅ Delete Judge
const deleteJudge = async (id) => {
    try {
        const judge = await Admin.findByIdAndDelete(id);

        if (!judge) {
            return { status: 404, message: "Judge not found" };
        }

        return { status: 200, message: "Judge deleted successfully" };
    } catch (err) {
        return { status: 500, message: err.message };
    }
};

// ✅ Submit Score (Judge Only)
const submitScore = async (judgeId, judgeName, registrationId, scoreData) => {
    try {
        console.log("Saving Score for ID:", registrationId);
        console.log("Score Data received:", scoreData);

        const registration = await Registration.findById(registrationId);

        if (!registration) {
            return { status: 404, message: "Registration not found" };
        }

        const validated = normalizeAndValidateScore(scoreData);
        if (!validated.ok) {
            return { status: 400, message: validated.message };
        }

        const normalized = validated.data;

        const existingScoreIndex = registration.scores.findIndex(s => (s.judgeId?._id || s.judgeId).toString() === judgeId.toString());

        if (existingScoreIndex !== -1) {
            console.log("Updating existing score...");
            registration.scores[existingScoreIndex].cat1 = normalized.cat1;
            registration.scores[existingScoreIndex].cat2 = normalized.cat2;
            registration.scores[existingScoreIndex].cat3 = normalized.cat3;
            registration.scores[existingScoreIndex].cat4 = normalized.cat4;
            registration.scores[existingScoreIndex].cat5 = normalized.cat5;
            registration.scores[existingScoreIndex].totalScore = normalized.totalScore;
            registration.scores[existingScoreIndex].comments = normalized.comments;
        } else {
            if (registration.scores.length >= SCORING.MAX_JUDGES) {
                return { status: 400, message: `Maximum ${SCORING.MAX_JUDGES} judges can score each participant` };
            }
            console.log("Adding new score...");
            registration.scores.push({
                judgeId,
                judgeName,
                cat1: normalized.cat1,
                cat2: normalized.cat2,
                cat3: normalized.cat3,
                cat4: normalized.cat4,
                cat5: normalized.cat5,
                totalScore: normalized.totalScore,
                comments: normalized.comments
            });
        }

        await registration.save();

        return {
            status: 200,
            message: "Score submitted successfully",
            data: registration
        };

    } catch (err) {
        return { status: 500, message: err.message };
    }
};

module.exports = {
    createJudge,
    getAllJudges,
    updateJudge,
    deleteJudge,
    submitScore
};
