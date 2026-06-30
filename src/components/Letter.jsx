const paragraphs = [
  'My Princess, my Sunshine, my Icon, my Superstar, my baby, my sexy, hot and spicy efo riro.',
  '22 and fabulous. Words fail me. You are amazing — a gift, a muse, my motivation.',
  '__WHY AM I YOUR NUMBER ONE FAN?__ You are a standard. You are graceful and elegant, stylish and hard-working, a motivation and an inspiration.',
  'I look at you and I know for certain God is amazing — if a creation can be so magnificent, indeed the Creator is Almighty. You have been one of the best additions to my life yet, a gift from God. You have such a big heart; you are so genuine about your loved ones.',
  'I love everything about you. I love how organised you are, how you hold yourself accountable, how hard-working you are. I love your big brain — you know how to apply yourself so well. I love how much you know yourself, how much you care for and how you treat “my girls,” how intentional you are.',
  'I love bantering with you. I love your friendship and companionship, your fashion style, your taste in music and anime, and how much I can be myself with you.',
  'I love your smile, I love your smell, I love your big forehead, and I am in love and in serious awe of your physique — second to absolutely nothing. You are the most beautiful creation in the Universe.',
  'I love you so much, babygirl. You are my heart, my fantasy, my dream girl, my forever one.',
  'Happy birthday, Sunshine. I wish you the world and an expected end. God bless you. Have the best day.',
]

const PART_ONE = paragraphs.slice(0, 4)
const PART_TWO = paragraphs.slice(4)

function renderEmphasis(text) {
  const parts = text.split(/__(.+?)__/g)
  return parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : <span key={i}>{p}</span>))
}

export default function Letter({ part = 1 }) {
  if (part === 1) {
    return (
      <div className="letter-content">
        <p className="letter-eyebrow kicker">No. 07 · A Letter From Her Number One Fan</p>
        <blockquote className="letter-verse">
          “Many women do noble things, but you surpass them all.”
          <cite>— Proverbs 31:29</cite>
        </blockquote>
        <h2 className="letter-title">To My Maths Genius</h2>
        <div className="letter-body">
          {PART_ONE.map((p, i) => (
            <p key={i}>{renderEmphasis(p)}</p>
          ))}
        </div>
        <p className="letter-turn kicker">continued →</p>
      </div>
    )
  }

  return (
    <div className="letter-content">
      <p className="letter-eyebrow kicker">No. 07 · …continued</p>
      <div className="letter-body letter-body-two">
        {PART_TWO.map((p, i) => (
          <p key={i}>{renderEmphasis(p)}</p>
        ))}
      </div>
      <p className="letter-sign">
        xoxo,
        <span className="letter-name">Tobi</span>
      </p>
    </div>
  )
}
