export const GROUP_LABEL = 'content_group_label';

export const Types = {
  Int: 'int64',
  String: 'string',
  Checksum: 'checksum256',
  Asset: 'asset',
  Name: 'name',
  TimePoint: 'time_point',
} 

export const getItem = (label, value, type=Types.String) => (
  {
    "label": label,
    "value": [
        type,
        value
    ]
  }
);