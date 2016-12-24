var fs = require('fs'), 
    jspath = require('jspath'), 
    jp = jspath.apply, 
    filehound = require('filehound');

function extract(astPath) {
	var ast = JSON.parse(fs.readFileSync(astPath, 'utf8'));

	var classDef = jp('${.nodeType=="Stmt_Class" && .type==0}', ast);
	if(classDef === undefined || classDef.length === 0) {
	    console.log('Totally skipping ' + astPath);
	    return;
	}

	var out = {
		name: classDef[0].name,
		fields: {}
	};

	console.log('Processing class ' + out.name);

	if (!out.name.match(/^OnApp_\w+$/)) {
		console.log('Skipping', out.name);
		return;
	}

	var result = jp('.{.nodeType == "Stmt_Class" && .name == "' + out.name + '"} .stmts{.nodeType == "Stmt_ClassMethod" && .name == "initFields"} .stmts{.nodeType == "Stmt_Switch"}', ast)[0] || {};

	for(c of result.cases || []) {
		var assigns = jp('.{.nodeType == "Expr_Assign"}', c.stmts);

		for(assign of assigns) {
			if(assign.var.name != "fields" && assign.var.var.name != "fields") {
				continue;
			}

			var items = jp('${.nodeType=="Expr_ArrayItem"}', assign.expr.items);

			if(typeof(items) === 'undefined') {
				continue;
			}

			for(item of items) {

				// Key may sometimes be null
				// In this case, we just push an empty field
				if(item.key === null) {
				    console.log('Faking ' + item.value.value);
				    out.fields[item.value.value] = {};
				    continue;
				}

				if(item.key.nodeType != 'Scalar_String' && item.key.nodeType != 'Expr_ConstFetch') {
					continue;
				}

				var fieldName = item.key.value || assign['var'].dim.value

				var v = {
				};

				var a = [];
				switch(item.key.nodeType) {
					case "Scalar_String":
						a = item.value.items;
						break;
					case "Expr_ConstFetch":
						a = [item];
						break;
				}
				
				for(field of a) {
					var attrName = field.key.name.parts[0];

					switch(attrName) {
						case "ONAPP_FIELD_TYPE":
							v.type = field.value.value;
							continue;
						case "ONAPP_FIELD_REQUIRED":
							v.required = true;
							continue;
						case "ONAPP_FIELD_MAP":
						case "ONAPP_FIELD_READ_ONLY":
						case "ONAPP_FIELD_DEFAULT_VALUE":
						case "ONAPP_FIELD_CLASS":
							continue;
						default:
							console.log("unknown type:", attrName)

					}
				}

				out.fields[fieldName] = Object.assign(out.fields[fieldName] || {}, out.fields[fieldName], v);
			}
		}
	}
	return out;
}

const files = filehound.create()
    .paths('_scratch/OnApp-PHP-Wrapper-External').ext('json')
    .find((err, astFiles) => {
	if(err) {
	    console.log(err);
	    return;
	}
	for(astFile of astFiles) {
	    console.log("Running " + astFile);
	    try {
		var result = extract(astFile);
		if(typeof(result) !== 'undefined') {
		    fs.writeFileSync('./generated/' + result.name + '.json', JSON.stringify(result));
		}
	    }
	    catch(e) {
		console.log("Failed", e);
		break;
	    }
	}
    });
