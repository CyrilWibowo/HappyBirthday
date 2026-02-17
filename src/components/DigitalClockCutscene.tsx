import { useState, useEffect, useCallback, useRef } from 'react'
import confetti from 'canvas-confetti'
import './DigitalClockCutscene.css'
import pusheenSleep from '../assets/pusheen_sleep.gif'
import pusheenBirthdayDance from '../assets/pusheen_birthday_dance.gif'
import catPointLaugh from '../assets/cat_point_laugh.gif'
import catThumbsUp from '../assets/cat_thumbs_up.gif'
import pusheenCake from '../assets/pusheen_cake.gif'
import pusheenHappyBirthday from '../assets/pusheen_happy_birthday.gif'
import pusheenBalloon from '../assets/pusheen_balloon.gif'
import pusheenCake2 from '../assets/pusheen_cake_2.gif'
import pusheenPartyBlower from '../assets/pusheen_party_blower.gif'

interface DigitalClockCutsceneProps {
  onComplete: () => void
}

interface TimeState {
  day: string
  month: string
  year: string
  hours: string
  minutes: string
  seconds: string
}

function DigitalClockCutscene({ onComplete }: DigitalClockCutsceneProps) {
  const [time, setTime] = useState<TimeState>({
    day: '19',
    month: '02',
    year: '2025',
    hours: '23',
    minutes: '59',
    seconds: '55',
  })
  const [isComplete, setIsComplete] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const messageRef = useRef<HTMLDivElement>(null)

  const smoothScrollTo = useCallback((targetY: number, duration: number) => {
    const startY = window.scrollY
    const difference = targetY - startY
    const startTime = performance.now()

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeInOutCubic(progress)

      window.scrollTo(0, startY + difference * easedProgress)

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [])

  const scrollToMessage = useCallback(() => {
    if (isComplete && !hasScrolled && messageRef.current) {
      setHasScrolled(true)
      const targetY = messageRef.current.offsetTop
      smoothScrollTo(targetY, 1000)
      onComplete()
    }
  }, [isComplete, hasScrolled, onComplete, smoothScrollTo])

  const tick = useCallback(() => {
    setTime((prev) => {
      let seconds = parseInt(prev.seconds)
      let minutes = parseInt(prev.minutes)
      let hours = parseInt(prev.hours)
      let day = parseInt(prev.day)

      seconds++

      if (seconds >= 60) {
        seconds = 0
        minutes++
      }

      if (minutes >= 60) {
        minutes = 0
        hours++
      }

      if (hours >= 24) {
        hours = 0
        day++
      }

      return {
        ...prev,
        day: day.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
      }
    })
  }, [])

  useEffect(() => {
    if (isComplete) return

    const interval = setInterval(() => {
      tick()
    }, 1000)

    return () => clearInterval(interval)
  }, [tick, isComplete])

  useEffect(() => {
    if (
      time.day === '20' &&
      time.hours === '00' &&
      time.minutes === '00' &&
      time.seconds === '00' &&
      !isComplete
    ) {
      setIsComplete(true)
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      })
    }
  }, [time, isComplete])

  useEffect(() => {
    if (isComplete && !hasScrolled) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isComplete, hasScrolled])

  useEffect(() => {
    if (!isComplete || hasScrolled) return

    const handleInteraction = () => scrollToMessage()

    window.addEventListener('click', handleInteraction)
    window.addEventListener('touchstart', handleInteraction)
    window.addEventListener('keydown', handleInteraction)

    return () => {
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
    }
  }, [isComplete, hasScrolled, scrollToMessage])


  if (!isComplete) {
    return (
      <div className="cutscene-container">
        <div className="background-20">20</div>
        <img src={pusheenSleep} alt="Sleeping Pusheen" className="pusheen-sleep" />
        <div className="clock-wrapper">
          <div className="time-display">
            <DigitGroup value={time.hours} heightVar="--time-digit-height" />
            <span className="colon">:</span>
            <DigitGroup value={time.minutes} heightVar="--time-digit-height" />
            <span className="colon">:</span>
            <DigitGroup value={time.seconds} heightVar="--time-digit-height" />
          </div>
          <div className="date-display">
            <DigitGroup value={time.day} heightVar="--date-digit-height" />
            <span className="separator">/</span>
            <DigitGroup value={time.month} heightVar="--date-digit-height" />
            <span className="separator">/</span>
            <DigitGroup value={time.year} heightVar="--date-digit-height" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="cutscene-container birthday">
        <div className="background-21">21</div>
        <img src={pusheenBirthdayDance} alt="Birthday Pusheen" className="pusheen-birthday" />
        <div className="birthday-text">Happy Birthday Shi-Xian!</div>
        {!hasScrolled && <div className="tap-prompt">tap to continue . . .</div>}
      </div>

      <div className="message-section" ref={messageRef}>
        <div className="message-container">
          <div className="message-greeting">
            Dear Shi-Xian,
          </div>
          <div className="message-body-wrapper">
            <div className="message-text">
              <span className="colorful-text">HAPPY BIRTHDAY!</span> OMG YOU ARE 21! It's okay we can be old together now but you can't make fun of me
              anymore hahahaha. <img src={catPointLaugh} alt="cat laughing" className="inline-gif" /> Anyways
              I hope you're doing well! I know we don't talk much anymore but I really do miss talking to you.
              You are one of the nicest people I have met and I couldn't have asked to meet a better person.
              Everything nice I've said about you is not because I wanted to be nice but is just because it's true.
              Thank you for everything you've done for me, even though I don't deserve it. I'm sorry that I never
              showed appropriate gratitude for the times you tried to make me feel better. I'm sorry for being such
              a terrible friend, I hope you can forgive me. I hope you enjoyed this virtual card I made for you and
              all the gifts. And again <span className="colorful-text">HAPPY BIRTHDAY!</span> I hope you have a great 21, hopefully it will treat you better than it treated me. <img src={catThumbsUp} alt="cat thumbs up" className="inline-gif" />. Thanks for all the good times we had together. Thanks for being my one and only escape from reality. And thanks for being my only and last glimmer of happiness. I will forever be indebted to you.
            </div>
          </div>
          <div className="decorations-row">
            <img src={pusheenPartyBlower} alt="Pusheen party blower" className="decoration-gif small" />
            <img src={pusheenHappyBirthday} alt="Pusheen happy birthday" className="decoration-gif small" />
            <img src={pusheenBalloon} alt="Pusheen balloon" className="decoration-gif" />
          </div>
          <div className="message-signature">
            <span className="signature-note">(hopefully still, but have a feeling not anymore)</span> Your BFF, Cyril
          </div>
        </div>
      </div>
    </div>
  )
}

interface DigitGroupProps {
  value: string
  heightVar: string
}

function DigitGroup({ value, heightVar }: DigitGroupProps) {
  return (
    <div className="digit-group">
      {value.split('').map((digit, index) => (
        <ScrollingDigit key={index} digit={digit} heightVar={heightVar} />
      ))}
    </div>
  )
}

interface ScrollingDigitProps {
  digit: string
  heightVar: string
}

function ScrollingDigit({ digit, heightVar }: ScrollingDigitProps) {
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  const digitIndex = digits.indexOf(digit)

  return (
    <div className="digit-container">
      <div
        className="digit-scroll"
        style={{
          transform: `translateY(calc(var(${heightVar}) * ${-digitIndex}))`,
        }}
      >
        {digits.map((d) => (
          <div key={d} className="digit">
            {d}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DigitalClockCutscene
