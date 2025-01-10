---
title: Non-capturing group in Python regex
tags:
  - regex
  - nlp
sources:
  - https://docs.python.org/3/howto/regex.html#non-capturing-and-named-groups
  - https://stackoverflow.com/questions/50857600/unexpected-result-for-python-re-sub-with-non-capturing-character
  - https://docs.python.org/3/howto/regex.html#non-capturing-and-named-groups/
---
# Description

Sometimes you’ll want to use a group to denote a part of a regular expression, but aren’t interested in retrieving the group’s contents.
You can make this fact explicit by using a non-capturing group: `(?:...)`, where you can replace the ... with any other regular expression.
The non-capturing group still matches and consumes the matched text.
Note that consuming means adding the matched text to the match value.

# Example

```python
>>> m = re.match("([abc])+", "abc")
>>> m.groups()
('c',)
>>> m = re.match("(?:[abc])+", "abc")
>>> m.groups()
()
```