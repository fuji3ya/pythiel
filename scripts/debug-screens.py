# -*- coding: utf-8 -*-
# 全画面 静的監査: id参照整合 / bundleバージョン / リンク切れ / sessionStorageキー / 日付 / 禁止語
import io, json, os, re, sys

BASE = os.path.join(os.path.dirname(__file__), '..', 'design', 'mockups')
issues = []

def read(p):
    return io.open(p, encoding='utf-8').read()

htmls = {f: read(os.path.join(BASE, f)) for f in os.listdir(BASE) if f.endswith('.html')}
print('screens:', ', '.join(sorted(htmls)))

# ── C1: JS の getElementById / querySelector('#') 参照が HTML に実在するか ──
print('\n--- C1: id 参照整合 (footnote-a 型の横展開検出) ---')
for name, src in sorted(htmls.items()):
    ids_defined = set(re.findall(r'id="([^"]+)"', src))
    refs = set(re.findall(r"getElementById\(\s*['\"]([^'\"]+)['\"]\s*\)", src))
    refs |= set(re.findall(r"querySelector\(\s*['\"]#([A-Za-z0-9_-]+)['\"]\s*\)", src))
    missing = sorted(r for r in refs if r not in ids_defined)
    if missing:
        for m in missing:
            issues.append(f'{name}: JS が参照する id "{m}" が HTML に存在しない')
            print(f'  X {name}: id "{m}" 不在')
    else:
        print(f'  OK {name}: {len(refs)} 参照すべて実在')

# ── C2: bundle バージョン一貫性 ──
print('\n--- C2: engine.bundle.js バージョン ---')
vers = {}
for name, src in sorted(htmls.items()):
    m = re.search(r'engine\.bundle\.js\?v=(\d+)', src)
    if m:
        vers[name] = m.group(1)
        print(f'  {name}: v={m.group(1)}')
uniq = set(vers.values())
if len(uniq) > 1:
    issues.append(f'bundle バージョン不一致: {vers}（古い v はキャッシュずれ→旧バグ再発リスク）')
    print(f'  X 不一致: {sorted(uniq)}')

# ── C3: リンク切れ（ローカル href/src）──
print('\n--- C3: ローカル参照ファイル実在 ---')
for name, src in sorted(htmls.items()):
    links = re.findall(r'(?:href|src)="(\.\.?/[^"#?]+)', src)
    for l in set(links):
        p = os.path.normpath(os.path.join(BASE, l))
        if not os.path.exists(p):
            issues.append(f'{name}: 参照先が存在しない: {l}')
            print(f'  X {name}: {l}')
print('  (上に X が無ければ全ファイル実在)')

# ── C4: sessionStorage キー整合（書き手と読み手） ──
print('\n--- C4: sessionStorage キー ---')
writes, reads = {}, {}
for name, src in sorted(htmls.items()):
    for k in re.findall(r"setItem\(\s*['\"]([^'\"]+)['\"]", src):
        writes.setdefault(k, set()).add(name)
    for k in re.findall(r"getItem\(\s*['\"]([^'\"]+)['\"]", src):
        reads.setdefault(k, set()).add(name)
for k in sorted(set(writes) | set(reads)):
    w = ','.join(sorted(writes.get(k, {'-'})))
    r = ','.join(sorted(reads.get(k, {'-'})))
    orphan = ''
    if k not in writes:
        orphan = '  <- 読むだけ(書き手なし)'
        issues.append(f'storage キー "{k}" は読まれるが誰も書かない')
    if k not in reads:
        orphan = '  <- 書くだけ(読み手なし=dead)'
        # pickedIdx は将来用の可能性があるので warning 扱い
    print(f'  {k}: write[{w}] read[{r}]{orphan}')

# ── C5: モック日付の一貫性 ──
print('\n--- C5: ハードコード日付 ---')
for name, src in sorted(htmls.items()):
    dates = set(re.findall(r'2026[-年·\s]*0?6[-月·\s]*\d{1,2}', src)) | set(re.findall(r"date:\s*'(2026-\d\d-\d\d)'", src))
    odd = [d for d in dates if '24' not in d and '2 4' not in d]
    if odd:
        for d in odd:
            issues.append(f'{name}: 日付揺れ "{d}"（モック基準は 2026-06-24）')
            print(f'  X {name}: {d}')
print('  (上に X が無ければ 6-24 に統一)')

# ── B: 全コーパス監査（構文 / 禁止語 / 誤字 / 旧ブランド語 / 空文字）──
print('\n--- B: コーパス全13ファイル監査 ---')
CDIR = os.path.join(os.path.dirname(__file__), '..', 'lib', 'synthesis', 'corpus')
BAN = ['絶対に', '必ず', '運命の人', '別れるべき', 'Pythia は', 'Pythiaは', 'undefined', '（仮）']
TYPO = [r'[ぁ-ん]んのかも', r'てのかも', r'すのです。です']
for f in sorted(os.listdir(CDIR)):
    if not f.endswith('.json') or f.startswith('_') or '.tmp' in f:
        continue
    p = os.path.join(CDIR, f)
    try:
        data = json.load(io.open(p, encoding='utf-8'))
    except Exception as e:
        issues.append(f'{f}: JSON parse 失敗 {e}')
        print(f'  X {f}: parse 失敗')
        continue
    text = json.dumps(data, ensure_ascii=False)
    hits = []
    for b in BAN:
        n = text.count(b)
        if n:
            hits.append(f'{b}x{n}')
    for t in TYPO:
        m = re.findall(t, text)
        if m:
            hits.append(f'typo?{m[:2]}')
    # 空文字列フィールド
    def walk(o, path=''):
        if isinstance(o, dict):
            for k, v in o.items():
                walk(v, path + '/' + k)
        elif isinstance(o, str):
            if not o.strip():
                hits.append(f'空文字@{path}')
    walk(data)
    if hits:
        issues.append(f'{f}: {hits}')
        print(f'  X {f}: {hits}')
    else:
        print(f'  OK {f}')

print(f'\n=== issues: {len(issues)} ===')
for i in issues:
    print(' -', i)
sys.exit(1 if issues else 0)
