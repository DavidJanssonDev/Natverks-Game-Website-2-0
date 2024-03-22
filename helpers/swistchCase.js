function handelbars_switch_function(value, options) {
  this.switch_value = value;
  return options.fn(this);
}

function handelbars_case_function(value, options) {
  if (value == this.switch_value) {
    return options.fn(this);
  }
}

module.exports = {
  switch: handelbars_switch_function,
  case: handelbars_case_function,
};
