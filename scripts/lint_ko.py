# 한국어 글에서 AI가 쓴 티가 나는 패턴을 센다.
# 사용: python3 scripts/lint_ko.py content/posts/1.html ...   (원본과 비교하려면 --orig)
import json, re, statistics, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# 기계적으로 쓴 글에 유독 많이 나오는 표현
STOCK = ['필수적', '핵심', '완벽', '극강', '효과적', '다양한', '섬세한', '진정한', '아름답게', '명심',
         '미연에', '비결', '첫걸음', '선물할', '행복한 반려', '깊이 있게', '알아보겠습니다', '알아보겠',
         '어떨까요', '골든타임', '바람직', '천차만별', '일상 속', '마주하게', '결론적으로', '본 칼럼',
         '비약적', '해독', '굳건한', '극대화', '현저히', '전적으로', '서론', '본론', '결론:', '공유합니다',
         '소개합니다', '정리해 드립니다', '안내합니다', '반드시']

def text_of(html):
    html = re.sub(r'<!--.*?-->', '', html, flags=re.S)
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', html)).strip()

def score(text):
    sents = [s for s in re.split(r'(?<=[.!?])\s+', text) if len(s) > 1]
    lens = [len(s) for s in sents]
    cv = statistics.pstdev(lens) / statistics.mean(lens) if lens else 0
    formal = sum(1 for s in sents if re.search(r'(습니다|입니다|습니까)[.!?]$', s))
    stock = {w: text.count(w) for w in STOCK if w in text}
    return {
        'chars': len(text),
        'sentences': len(sents),
        'len_cv': round(cv, 2),            # 문장 길이 들쭉날쭉한 정도. 0.45 이상이 자연스러움
        'formal_pct': round(100 * formal / max(len(sents), 1)),  # ~습니다 비율
        'stock_hits': sum(stock.values()),
        'stock': stock,
    }

def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if '--orig' in sys.argv:
        data = {str(p['id']): p['content'] for p in json.load(open(ROOT / 'blog_data.json', encoding='utf-8'))}
        data.update({str(30 + int(t['id'])): t['ko']['content'] for t in json.load(open(ROOT / 'travel_data.json', encoding='utf-8'))})
        for a in args:
            pid = Path(a).stem
            print(pid, 'before', score(text_of(data[pid])))
            print(pid, 'after ', score(text_of(Path(a).read_text(encoding='utf-8'))))
    else:
        for a in args:
            print(Path(a).stem, score(text_of(Path(a).read_text(encoding='utf-8'))))

if __name__ == '__main__':
    main()
