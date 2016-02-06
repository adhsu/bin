'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.grabTitle = grabTitle;

var _nodeMetainspector = require('node-metainspector');

var _nodeMetainspector2 = _interopRequireDefault(_nodeMetainspector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function grabTitle(req, res) {

  var url = req.body.url;
  console.log('grabbing title with url', url);
  if (url.endsWith('gif') || url.endsWith('gifv') || url.endsWith('jpg') || url.endsWith('jpeg') || url.endsWith('mov') || url.endsWith('png')) {
    return res.send({ ok: false });
  }

  // handle airbnb and imgur variations

  var client = new _nodeMetainspector2.default(req.body.url, { timeout: 5000 });

  client.on("fetch", function () {
    res.json({
      ok: true,
      data: {
        'title': client.title,
        'ogTitle': client.ogTitle,
        'host': client.host,
        'image': client.image,
        'ogImage': client.ogImage,
        'ogDescription': client.ogDescription,
        'description': client.description
      }
    });
  });

  client.on("error", function (err) {
    res.json({ "ok": "false" });
  });

  client.fetch();
}
//# sourceMappingURL=scraper.js.map