'use strict';

var bytes = require('bytes');
var Course = require('../models/course');
var CourseGroup = require('../models/courseGroup');
var path = require('path');

// Group info for a participant, with user instructions on how to login
exports.get = function*() {

  var group = this.groupBySlug;

  var material = group.materials.filter(m => m.filename == this.params.filename)[0];

  // ensure the path to material is valid
  if (!material) {
    this.throw(404, {
      info: 'Ссылка неверна. Возможно, этот материал был добавлен по ошибке и позже удалён из преподавателем.'
    });
  }

  // materials may be updated with the same name
  this.nocache();

  this.set({
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': 'attachment; filename=' + path.basename(material.filename),
    'X-Accel-Redirect': '/_download/' + group.getMaterialFileRelativePath(material)
  });

  this.body = '';
};
