import json, sys

with open('lib/synthesis/corpus/tarot-minor.v2.json', 'r', encoding='utf-8') as f:
    base = json.load(f)

with open('lib/synthesis/corpus/swords-patch.json', 'r', encoding='utf-8') as f:
    patch = json.load(f)

base.update(patch)

with open('lib/synthesis/corpus/tarot-minor.v2.json', 'w', encoding='utf-8', newline='\n') as f:
    json.dump(base, f, ensure_ascii=False, indent=2)

k = list(base.keys())
sw = [x for x in k if x.startswith('swords')]
print(f'total:{len(k)} swords:{len(sw)} VALID')
