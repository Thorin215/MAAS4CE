const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const truthDir = path.join(__dirname, 'truth');
const predictDir = path.join(__dirname, 'predict');

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/load/:num', (req, res) => {
    const num = req.params.num;
    const truthFilePath = path.join(truthDir, `im${num}.txt`);
    const predictFilePath = path.join(predictDir, `im${num}.txt`);
    let data = { groundTruth: [], prediction: [] };

    if (fs.existsSync(truthFilePath)) {
        const truthData = fs.readFileSync(truthFilePath, 'utf8');
        data.groundTruth = JSON.parse(truthData);
    }

    if (fs.existsSync(predictFilePath)) {
        const predictData = fs.readFileSync(predictFilePath, 'utf8');
        data.prediction = JSON.parse(predictData);
    }

    res.json({ success: fs.existsSync(truthFilePath) || fs.existsSync(predictFilePath), data });
});

app.post('/save/:num', (req, res) => {
    const num = req.params.num;
    const truthFilePath = path.join(truthDir, `im${num}.txt`);
    const predictFilePath = path.join(predictDir, `im${num}.txt`);
    const data = req.body.data;

    fs.writeFileSync(truthFilePath, JSON.stringify(data.groundTruth));
    fs.writeFileSync(predictFilePath, JSON.stringify(data.prediction));

    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
