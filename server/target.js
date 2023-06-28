const express = require("express")
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", (req, res) => {
    console.log(req.baseUrl);
    console.log("request body: ");
    console.table(req.body);
    res.json({ msg: 'ok' })
})

app.listen(process.env.tartget_port, () => {
    console.log(`target port listening on ${process.env.tartget_port}`)
})