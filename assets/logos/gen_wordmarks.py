"""Generate clean wordmark-style logo SVGs for manufacturer brands using
their researched real brand colors. Used where a hotlinkable official
vector logo could not be reliably sourced.
"""
import os

OUT = os.path.dirname(os.path.abspath(__file__))

def wordmark(filename, text, color, weight=800, letter_spacing="0.01em", font_style="normal", width=220, height=48, font_size=30, sub=None):
    sub_svg = ""
    if sub:
        sub_svg = f'<text x="8" y="{height-6}" font-family="Arial, Helvetica, sans-serif" font-size="9" font-weight="600" letter-spacing="0.12em" fill="{color}" opacity="0.75">{sub}</text>'
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-label="{text} logo">
  <text x="8" y="{int(height*0.68)}" font-family="Arial, Helvetica, sans-serif" font-size="{font_size}" font-weight="{weight}" font-style="{font_style}" letter-spacing="{letter_spacing}" fill="{color}">{text}</text>
  {sub_svg}
</svg>'''
    with open(os.path.join(OUT, filename), "w") as f:
        f.write(svg)

# Real researched brand colors:
wordmark("mohawk.svg", "MOHAWK", "#E41D38", weight=900, width=200, font_size=28)
wordmark("shaw.svg", "SHAW", "#0057A8", weight=900, width=150, font_size=30, sub="INDUSTRIES")
wordmark("armstrong.svg", "Armstrong", "#EE7623", weight=700, font_style="italic", width=210, font_size=27, sub="FLOORING")
wordmark("mannington.svg", "Mannington", "#00693E", weight=700, width=220, font_size=24)
wordmark("tarkett.svg", "tarkett", "#003054", weight=800, width=175, font_size=30)
wordmark("daltile.svg", "DALTILE", "#0B2340", weight=900, width=190, font_size=27)
wordmark("coretec.svg", "COREtec", "#00539B", weight=900, width=190, font_size=27)
wordmark("anderson_tuftex.svg", "Anderson Tuftex", "#677E54", weight=600, width=230, font_size=19)

print("done")
