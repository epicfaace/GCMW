import ExpressionParser from "../common/ExpressionParser";

test('dict array to sum dict', () => {
  expect(ExpressionParser.dict_array_to_sum_dict([{"a":2, "b":5}, {"a":1, "b":6}])).toEqual({'a': 3.00, 'b': 11.00});
  expect(ExpressionParser.dict_array_to_sum_dict([{"a":2, "b":5}, {"a":1}])).toEqual({'a': 3.00, 'b': 5.00});
});

describe('calculate_price', () => {
  test('basic', () => {
    expect(ExpressionParser.calculate_price("x * 12", {"x": 1})).toEqual(12.0);
  });
  test('array length', () => {
    expect(ExpressionParser.calculate_price("participants * 25", {"participants": [1,2,3]})).toEqual(75);
  });
  test('array calculations', () => {
    expect(ExpressionParser.calculate_price("2 * sponsorshipAnnadaanam:300 + sponsorshipAnnadaanam:600", {"sponsorshipAnnadaanam": [300, 600]})).toEqual(3);
  });
  test('array calculations subtraction', () => {
    expect(ExpressionParser.calculate_price("$participants - $participants.age:1", {"participants": [{age: 10}, {age: 1}]})).toEqual(1);
    expect(ExpressionParser.calculate_price("1.0 * ($participants - $participants.age:1)", {"participants": [{age: 10}, {age: 1}]})).toEqual(1);
  });
  test('array calculations with multiple subtraction', () => {
    expect(ExpressionParser.calculate_price("$participants - $participants.age:1 - $participants.age:2 - $participants.age:3 + $participants - $participants.age:1 - $participants.age:2 - $participants.age:3", {"participants": [{"age": 10}, {"age": 1}, {"age": 2}]} )).toEqual(2);
  });
  test('array calculations with multiple, repeated subtraction', () => {
    expect(ExpressionParser.calculate_price("$participants - $participants.age:1 - $participants.age:2 - $participants.age:3", {"participants": [{"age": 10}, {"age": 1}, {"age": 2}]} )).toEqual(1);
  })
  // todo: add more tests here.
})