---
slug: theranos-no-go-2013
caseStudySlug: theranos-fraud
type: historical
category: crisis
publishedAt: "2026-07-27T20:30:00+05:30"
year: 2013
estimatedMinutes: 6
principle: |
  The hardest call a senior employee at a hyped startup makes is the
  one to leave when the science doesn't work. Pattern-matched
  excellence (Stanford, board members, billions raised) doesn't
  override the data on your monitor. If the lab results don't
  reproduce, the company can't.
intro: |
  You are a senior R&D scientist at a high-profile health-tech
  startup. The company has raised $400M+ at a $9B valuation. The
  CEO is on the cover of business magazines. Board members include
  former Secretaries of State and military generals.

  The promised product is a blood-testing machine that can run
  hundreds of tests on a single finger-prick. Internally, the
  device works for ~12 specific tests under ideal conditions. The
  remaining tests run on standard commercial machines hidden behind
  a curtain — including all the tests being run on samples from the
  pharmacy partnership that just launched.

  Investor demos use the proprietary device for show, but the
  actual diagnostic results returned to patients come from the
  commercial machines. Three colleagues in your lab have raised
  this discrepancy with the CEO. All three have been moved off
  the project. You've been asked to sign an updated NDA.
nodes:
  start:
    dimension: founder
    prompt: |
      You're four years into a job you took because you believed in
      the mission. Pick the move.
    options:
      - text: "Sign the NDA. Stay quiet. Keep collecting the paycheck while you figure out next steps."
        points: 0
        pattern: complicity-by-inaction
        rationale: |
          Catastrophic. Every month you stay quiet is another month
          you become legally and morally entangled in the misuse
          of diagnostics on real patients. The NDA you sign will
          eventually be used to suppress your testimony. The
          paycheck argument always feels reasonable in the moment
          and ruinous in retrospect — your career and reputation
          will be defined by what happens when the truth comes out.
        consequence: |
          You sign. Two years later, the regulatory investigation
          breaks publicly. You're named in the SEC complaint. Your
          career in healthcare is over. Legal fees consume your
          savings.
        leadsTo: end-A
      - text: "Refuse to sign. Document everything you've seen. Resign and contact regulators."
        points: 5
        pattern: integrity-over-pattern-match
        rationale: |
          The right call, however hard. Real patients are receiving
          diagnostic results from machines being used outside their
          validated specifications — that's a patient-safety
          issue, not a startup-pivot question. The pattern-matched
          excellence around the company (the board, the press, the
          valuation) doesn't override the data on your monitor.
          Resigning + contacting regulators preserves your
          integrity, protects patients, and ends your association
          before the public reckoning.
        consequence: |
          You resign. Three months later you give voluntary
          testimony to FDA inspectors. The next year, the
          regulatory action breaks publicly. You're named as a
          whistleblower; your career in healthcare deepens because
          of the integrity, not despite it.
        leadsTo: B-resign-followup
      - text: "Take the issue to the board. Trust the governance to investigate."
        points: 3
        pattern: trust-the-governance
        rationale: |
          Defensible procedurally, often unreliable in practice.
          Boards at hyped startups with celebrity directors tend
          to defer to the CEO until the public reckoning forces
          action. Three colleagues already raised this issue and
          got moved off the project — that pattern is the signal
          that internal channels are captured. Going to the board
          rarely produces the corrective action a regulator
          would.
        consequence: |
          Your concerns are noted in a confidential memo. The
          board commissions an "external review" that takes 8
          months and reaches no conclusion. You're reassigned to
          a different team. You eventually resign in 6 months,
          quietly.
        leadsTo: end-C
      - text: "Stay but try to fix it from the inside. You're senior; you can push for better validation."
        points: 1
        pattern: hero-inside-the-broken-system
        rationale: |
          The "I'll fix it from within" rationalization. Three
          colleagues with similar seniority have already tried;
          they were moved off the project. The pattern is clear:
          the company isn't a science company with a leadership
          problem — it's a leadership-driven misuse of science.
          You can't fix that from inside without the leadership
          changing, and the leadership hasn't.
        consequence: |
          You spend 18 months trying. Nothing changes. You leave
          in late 2014. The story breaks in 2015. Your name is on
          patents and validation documents tied to the misuse.
        leadsTo: end-D
  B-resign-followup:
    dimension: founder
    prompt: |
      You resigned. The company is suing you for the NDA breach
      they claim you committed by talking to the FDA. You're
      receiving threats from private investigators hired by the
      company's law firm. A journalist has reached out asking for
      on-record testimony.
    options:
      - text: "Go on the record with the journalist. The public story is the only thing that protects you."
        points: 5
        pattern: transparency-as-defense
        rationale: |
          Defensive but correct. The intimidation campaign relies
          on the threat of public exposure cutting both ways.
          Going public first inverts the leverage: the company
          can't credibly threaten you for a story that's already
          out, and the regulators investigating the company now
          have public corroboration of the internal misconduct.
          The personal cost is real but transient; the
          legal/reputational cost of staying silent is permanent.
        consequence: |
          The journalist's story breaks. Other former employees
          come forward. The federal investigation accelerates.
          You become a key witness; the company's case against
          you collapses. Your name is associated with integrity,
          not complicity.
        leadsTo: end-B-great
      - text: "Stay quiet. Settle the NDA case privately. Rebuild your career outside the spotlight."
        points: 3
        pattern: settle-and-retreat
        rationale: |
          Survivable but ethically thinner. The settlement makes
          your immediate situation safer but leaves you bound to
          silence while patients continue to receive bad
          diagnostics. The harm doesn't stop because you signed
          a non-disparagement clause.
        consequence: |
          The settlement closes. You move to a different state
          and take a quieter role. The story breaks anyway 12
          months later, with other whistleblowers as the main
          voices.
        leadsTo: end-B-good
  end-A:
    isOutcome: true
    summary: |
      The complicity compounded. Years later, the public
      reckoning named you among the senior staff who knew. Career
      in healthcare ended; legal exposure substantial; reputation
      permanently damaged. The integrity choice was always
      available; you took the paycheck path.
  end-B-great:
    isOutcome: true
    summary: |
      The whistleblower path defined the rest of your career.
      Patient safety was eventually protected; the federal case
      named you as a credible source; your name in healthcare
      circles became synonymous with integrity. You rebuilt at a
      different lab and went on to do important work.
  end-B-good:
    isOutcome: true
    summary: |
      You survived but stayed out of the public story. Other
      whistleblowers told it without you. Your career continued
      but the silence sat with you for decades.
  end-C:
    isOutcome: true
    summary: |
      The board didn't act in time. You resigned 6 months later
      under the cloud of having raised concerns through "proper
      channels" that no one acted on. The eventual public story
      named the board as enablers; your role was peripheral but
      not absolved.
  end-D:
    isOutcome: true
    summary: |
      The "fix from within" path produced no change. By the time
      the story broke, your name was on validation documents
      tied to the misuse. The legal exposure was significant; the
      reputational damage lasting.
---

## What actually happened

This drill is based on the **Theranos scandal**, specifically the
period from 2013-2015 when senior scientists and engineers were
quietly raising concerns about the Edison device being used to
produce diagnostic results that weren't validated. Most of those
concerns were suppressed through NDAs, reassignment, and
intimidation. Tyler Shultz (grandson of board member George
Shultz) became one of the key whistleblowers in 2014-2015.

The Wall Street Journal investigation by John Carreyrou broke in
October 2015, leading to federal investigations, the eventual SEC
charges against CEO Elizabeth Holmes (2018), and the criminal
trial that ended in her 2022 conviction on four counts of fraud.

The principle: pattern-matched excellence (Stanford, the board,
the press, the valuation) doesn't override what you're seeing in
the lab. When the science doesn't reproduce, the company can't.
The hardest call senior employees make in hyped startups is the
one to leave when the data tells them to.

**Related reading:** [Theranos: what happens when trust is staged](/case-study/theranos-fraud)
