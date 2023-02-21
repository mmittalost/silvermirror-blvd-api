const path = require("path") 
var formidable = require('formidable');


exports.uploadFile = async function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.image.filepath;
        var oldName = files.image.originalFilename;
        var ext = oldName.substring(oldName.indexOf('.') + 1);
        const fileName = fields.type+'-'+fields.serviceId + '.' + ext;
        var newpath = path.join(__dirname,"../uploads/") + fileName;
        fs.rename(oldpath, newpath, function (err) {
          if (err) throw err;
          res.json({success:true, message:"File uploaded successfuly!"});
        });
    });
};
