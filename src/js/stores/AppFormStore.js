var EventEmitter = require("events").EventEmitter;
var lazy = require("lazy.js");
var Util = require("../helpers/Util");

var AppDispatcher = require("../AppDispatcher");
var AppFormTransforms = require("./AppFormTransforms");
var AppFormValidators = require("./AppFormValidators");
var FormEvents = require("../events/FormEvents");

const validationRules = {
  "appId": AppFormValidators.appId,
  "env": AppFormValidators.env
};

const transformationRules = {
  "appId": AppFormTransforms.appId,
  "env": AppFormTransforms.env
};

const resolveMap = {
  appId: "id",
  env: "env"
};

function isValidField(fieldId, value) {
  const validate = validationRules[fieldId];
  return validate == null || validate(value);
}

function insertField(fields, fieldId, index = null, value) {
  if (fieldId === "env") {
    Util.initKeyValue(fields, "env", []);
    if (index == null) {
      fields.env.push(value);
    } else {
      fields.env.splice(index, 0, value);
    }
  }
}

function updateField(fields, fieldId, index = null, value) {
  if (fieldId === "env") {
    Util.initKeyValue(fields, "env", []);

    if (fields.env[index] !== undefined) {
      fields.env[index] = value;
    }
  } else {
    fields[fieldId] = value;
  }
}

function deleteField(fields, fieldId, index) {
  if (fieldId === "env") {
    fields.env.splice(index, 1);
  }
}

function getTransformedField(fieldId, value) {
  const transform = transformationRules[fieldId];
  if (transform == null) {
    return value;
  }
  return transform(value);
}

function rebuildModelFromFields(app, fields, fieldId) {
  const key = resolveMap[fieldId];
  if (key) {
    let field = getTransformedField(fieldId, fields[fieldId]);
    app[key] = field;
  }
}

var AppFormStore = lazy(EventEmitter.prototype).extend({
  app: {},
  fields: {}
}).value();

function executeAction(action, setFieldFunction) {
  const fieldId = action.fieldId;
  const value = action.value;
  const index = action.index;

  // This is not a delete-action
  if (value !== undefined || index == null) {
    if (!isValidField(fieldId, value)) {
      AppFormStore.emit(FormEvents.FIELD_VALIDATION_ERROR, {
        fieldId: fieldId,
        value: value,
        index: index
      });
      return;
    }
  }

  setFieldFunction(AppFormStore.fields, fieldId, index, value);

  rebuildModelFromFields(AppFormStore.app, AppFormStore.fields, fieldId);

  AppFormStore.emit(FormEvents.CHANGE, fieldId);
}

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case FormEvents.INSERT:
      executeAction(action, insertField);
      break;
    case FormEvents.UPDATE:
      executeAction(action, updateField);
      break;
    case FormEvents.DELETE:
      executeAction(action, deleteField);
      break;
  }
});

module.exports = AppFormStore;
