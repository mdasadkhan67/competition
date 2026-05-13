import Stepper from './components/Stepper'
import { useState } from 'react'
import Terms from './components/steps/Terms'
import Personal from './components/steps/Personal'
import Address from './components/steps/Address'
import Details from './components/steps/Details'
import Upload from './components/steps/Upload'
import Payment from './components/steps/Payment'
import Success from './components/steps/Success'
import axios from 'axios'

function Home() {

    const [step, setStep] = useState(0)
    const [form, setForm] = useState({})
    const [files, setFiles] = useState({})
    const [result, setResult] = useState(null)

    const next = () => setStep((p) => p + 1)
    const prev = () => setStep((p) => p - 1)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFile = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    const submit = async () => {
        const fd = new FormData();

        Object.keys(form).forEach((key) => {
            fd.append(key, form[key]);
        });

        fd.append("payment", JSON.stringify({
            transactionId: form.transactionId,
            amount: form.amount
        }));

        fd.append("photo", files.photo);
        fd.append("proof", files.proof);
        fd.append("transactionProof", files.transactionProof);

        const res = await axios.post("http://localhost:3000/api/register", fd);

        setResult(res.data);
        next();
    };

    return (
        <div className="max-w-xl mx-auto p-4">
            <Stepper step={step} />

            {step === 0 && <Terms next={next} />}
            {step === 1 && <Personal form={form} handleChange={handleChange} next={next} />}
            {step === 2 && <Address form={form} handleChange={handleChange} next={next} />}
            {step === 3 && <Details form={form} handleChange={handleChange} next={next} />}
            {step === 4 && <Upload handleFile={handleFile} next={next} />}
            {step === 5 && <Payment form={form} handleChange={handleChange} submit={submit} />}
            {step === 6 && <Success result={result} />}
        </div>
    )
}

export default Home