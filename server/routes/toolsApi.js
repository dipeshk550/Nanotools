const express = require("express");
const router = express.Router();
const c = require("../controllers/toolsController");

router.post("/word-counter",       c.wordCounter);
router.post("/case-converter",     c.caseConverter);
router.post("/password-generator", c.passwordGenerator);
router.post("/hash-generator",     c.hashGenerator);
router.post("/uuid-generator",     c.uuidGenerator);
router.post("/base64",             c.base64);
router.post("/json-formatter",     c.jsonFormatter);
router.post("/jwt-decoder",        c.jwtDecoder);
router.post("/text-compare",       c.textCompare);
router.post("/emi-calculator",     c.emiCalculator);
router.post("/currency-converter", c.currencyConverter);
router.post("/qr-generator",       c.qrGenerator);
router.post("/slug-generator",     c.slugGenerator);
router.post("/url-encoder",        c.urlEncoderDecoder);
router.post("/lorem-ipsum",        c.loremIpsum);
router.post("/gpa-calculator",     c.gpaCalculator);

module.exports = router;
