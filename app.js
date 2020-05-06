const express = require('express');
const app = express();
const ejs = require('ejs');
const helmet = require('helmet');
const fs = require('fs');
const body_parser = require('body-parser');
const randomstring = require('randomstring');
const fendlydb = require("fendly.db");
const db = new fendlydb("./database.json");
const commontags = require('common-tags');

app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());
app.use(helmet());
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');

 const renderOutput = function (file, req, res, data = {}) {
    res.render(__dirname + `/views/${file}.ejs`, Object.assign({
      fs: fs,
    }, data));
  };

app.use(express.static('public'));

app.get('/', (req, res) => {
	renderOutput('index', req, res,{ disabled: false});
});

app.get('/code', (req,res) => {
  var code = req.query.id;
  console.log(code)
  var a = db.fetch(code);
  console.log(a)
  if(!a) return res.redirect("/"); else {
    console.log(a)
    const disabled = 'disabled';
    renderOutput('index', req, res, { disabled: true, code: a }); 
  }
})


app.post('/', (req, res) => {
  let randomid = randomstring.generate({ length: 14, charset: 'alphanumeric', capitalization: 'lowercase' });
  if(!req.body.code && req.body.code == "") return res.redirect("/");
  db.set(randomid, req.body.code);
  res.redirect('/code?id=' + randomid);
});

const listener = app.listen(process.env.PORT, () => {
	console.log('Your app is listening on port ' + listener.address().port);
});
