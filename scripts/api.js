
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs-extra');

app.listen(port, () => {
    console.log('Server started on port ' + port);
});

app.post('/deleteTempFile', (req, res) =>{
    //console.log(req);
    const filename = req.query.filename;
    fs.unlinkSync(`../php/files/${filename}`);
    
    res.send("Borrado");
});


app.post('/sendAll', (req, res) =>{
    fs.emptyDirSync(`../php/files`);
    res.send("Borrado");
});


