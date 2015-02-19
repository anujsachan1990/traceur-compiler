// Copyright 2012 Traceur Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

/**
 * @fileoverview This file generates the code for ParseTrees.js based on a JSON
 * file, which gets passed in on the command line.
 */

var fs = require('fs');
var util = require('./util.js');
var print = console.log.bind(console);

util.printLicense();
util.printAutoGenerated();

print("import {ParseTree} from './ParseTree.js';");
print("import * as ParseTreeType from './ParseTreeType.js';");

// export const ARGUMENT_LIST = 'ARGUMENT_LIST';
var data = fs.readFileSync(process.argv[2], 'utf-8');
var trees = util.parseJSON(data);

function getType(types) {
  return types.join('|');
}

function printInitializer(name) {
  print('    this.%s = %s;', name, name);
}

var names = Object.keys(trees);

names.forEach(function(name) {
  var treeTypeName = util.toConstantName(name);
  var paramNames = Object.keys(trees[name]);
  // var params = trees[name];
  // var paramNames = params.map(function(p) { return p.name; });
  print();
  print('const %s = ParseTreeType.%s;', treeTypeName, treeTypeName);
  print('export class %s extends ParseTree {', name);
  print('  /**');
  paramNames.forEach(function(paramName) {
    var types = trees[name][paramName];
    print('   * @param {%s} %s', getType(types), paramName);
  });
  print('   */');
  print('  constructor(%s) {', paramNames.join(', '));
  paramNames.forEach(printInitializer);
  print('  }');
  print();
  print('  /**');
  print('   * @param {ParseTreeTransformer} transformer');
  print('   */');
  print('  transform(transformer) {');
  print('    return transformer.transform%s(this);', name);
  print('  }');
  print();
  print('  /**');
  print('   * @param {ParseTreeVisitor} visitor');
  print('   */');
  print('  visit(visitor) {');
  print('    visitor.visit%s(this);', name);
  print('  }');
  print();
  print('  /**');
  print('   * @type {ParseTreeType}');
  print('   */');
  print('  get type() {');
  print('    return %s;', treeTypeName);
  print('  }');
  print('}');
});
