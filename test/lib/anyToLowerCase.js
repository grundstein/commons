import { anyToLowerCase } from '../../src/lib/anyToLowerCase.js'

export default [
  { fn: anyToLowerCase, expect: undefined, info: 'anyToLowerCase: empty argument gets returned' },
  {
    fn: anyToLowerCase(false),
    expect: false,
    info: 'anyToLowerCase: "false" argument gets returned',
  },
  {
    fn: anyToLowerCase('ALL_UPPER_CASE'),
    expect: 'all_upper_case',
    info: 'anyToLowerCase removes port before cleaning',
  },
  {
    fn: anyToLowerCase(['ALL_UPPER_CASE_1', 'ALL_UPPER_CASE_2', 'all_lower_case_1']),
    expect: ['all_upper_case_1', 'all_upper_case_2', 'all_lower_case_1'],
    info: 'anyToLowerCase handles arrays',
  },
  {
    fn: anyToLowerCase('PArt_UPPer_CASE_1'),
    expect: 'part_upper_case_1',
    info: 'anyToLowerCase handles words where parts are uppercased',
  },
  {
    fn: anyToLowerCase(['PArt_UPPer_CASE_1', 0, false, 123]),
    expect: ['part_upper_case_1', 0, false, 123],
    info: 'anyToLowerCase handles non-string array arguments',
  },
  {
    fn: anyToLowerCase(123),
    expect: 123,
    info: 'anyToLowerCase returns numbers unchanged',
  },
  {
    fn: anyToLowerCase({ key: 'value' }),
    expect: { key: 'value' },
    info: 'anyToLowerCase returns objects unchanged',
  },
  {
    fn: anyToLowerCase(false),
    expect: false,
    info: 'anyToLowerCase returns boolean false unchanged',
  },
  {
    fn: anyToLowerCase(true),
    expect: true,
    info: 'anyToLowerCase returns boolean true unchanged',
  },
  {
    fn: anyToLowerCase(undefined),
    expect: undefined,
    info: 'anyToLowerCase returns undefined unchanged',
  },
  {
    fn: anyToLowerCase(null),
    expect: null,
    info: 'anyToLowerCase returns null unchanged',
  },
]
