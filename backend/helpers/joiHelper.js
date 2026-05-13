class JoiHelper {
    static validate(schema, data) {
        return new Promise((resolve, reject) => {
            const { error, value } = schema.validate(data);

            if (error) {
                return reject({
                    status: 400,
                    message: error.details[0].message,
                });
            }

            resolve(value);
        });
    }
}

module.exports = JoiHelper;