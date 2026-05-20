"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AiFillAudio,
  AiFillBulb,
  AiFillFileText,
} from "react-icons/ai";
import { BiCrown } from "react-icons/bi";
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import { RiLeafLine } from "react-icons/ri";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AuthModal, { AuthMode } from "@/components/AuthModal";
import { auth } from "@/lib/firebase";

const headerBenefits = [
  "Enhance your knowledge",
  "Achieve greater success",
  "Improve your health",
  "Develop better parenting skills",
  "Increase happiness",
  "Be the best version of yourself!",
];

const secondBenefits = [
  "Expand your learning",
  "Accomplish your goals",
  "Strengthen your vitality",
  "Become a better caregiver",
  "Improve your mood",
  "Maximize your abilities",
];

const reviews = [
  {
    name: "Hanna M.",
    body: (
      <>
        This app has been a <b>game-changer</b> for me! It&apos;s saved me so
        much time and effort in reading and comprehending books. Highly
        recommend it to all book lovers.
      </>
    ),
  },
  {
    name: "David B.",
    body: (
      <>
        I love this app! It provides <b>concise and accurate summaries</b> of
        books in a way that is easy to understand. It&apos;s also very
        user-friendly and intuitive.
      </>
    ),
  },
  {
    name: "Nathan S.",
    body: (
      <>
        This app is a great way to get the main takeaways from a book without
        having to read the entire thing.{" "}
        <b>The summaries are well-written and informative.</b> Definitely worth
        downloading.
      </>
    ),
  },
  {
    name: "Ryan R.",
    body: (
      <>
        If you&apos;re a busy person who{" "}
        <b>loves reading but doesn&apos;t have the time</b> to read every book
        in full, this app is for you! The summaries are thorough and provide a
        great overview of the book&apos;s content.
      </>
    ),
  },
];

const footerGroups = [
  {
    title: "Actions",
    links: ["Summarist Magazine", "Cancel Subscription", "Help", "Contact us"],
  },
  {
    title: "Useful Links",
    links: ["Pricing", "Summarist Business", "Gift Cards", "Authors & Publishers"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Partners", "Code of Conduct"],
  },
  {
    title: "Other",
    links: ["Sitemap", "Legal Notice", "Terms of Service", "Privacy Policies"],
  },
];

export default function Home() {
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [userLabel, setUserLabel] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUserLabel("");
        return;
      }

      setUserLabel(user.email || "Guest user");
    });

    return unsubscribe;
  }, []);

  function openAuthModal(mode: AuthMode) {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  }

  function handlePrimaryAction() {
    if (userLabel) {
      router.push("/for-you");
      return;
    }

    openAuthModal("login");
  }

  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <>
      <nav className="nav">
        <div className="nav__wrapper">
          <figure className="nav__img--mask">
            <Image
              className="nav__img"
              src="/assets/logo.png"
              alt="Summarist"
              width={220}
              height={68}
              priority
            />
          </figure>
          <ul className="nav__list--wrapper">
            <li>
              {userLabel ? (
                <button
                  className="nav__list nav__list--login"
                  onClick={handleLogout}
                  type="button"
                >
                  Logout
                </button>
              ) : (
                <button
                  className="nav__list nav__list--login"
                  onClick={() => openAuthModal("login")}
                  type="button"
                >
                  Login
                </button>
              )}
            </li>
            <li className="nav__list nav__list--mobile">About</li>
            <li className="nav__list nav__list--mobile">Contact</li>
            <li className="nav__list nav__list--mobile">Help</li>
          </ul>
        </div>
      </nav>

      <main>
        <section id="landing">
          <div className="container">
            <div className="row">
              <div className="landing__wrapper">
                <div className="landing__content">
                  <h1 className="landing__content__title">
                    Gain more knowledge <br className="remove--tablet" />
                    in less time
                  </h1>
                  <p className="landing__content__subtitle">
                    Great summaries for busy people,
                    <br className="remove--tablet" />
                    individuals who barely have time to read,
                    <br className="remove--tablet" />
                    and even people who don&apos;t like to read.
                  </p>
                  <button
                    className="btn home__cta--btn"
                    onClick={handlePrimaryAction}
                    type="button"
                  >
                    {userLabel ? "Continue reading" : "Login"}
                  </button>
                </div>
                <figure className="landing__image--mask">
                  <Image
                    src="/assets/landing.png"
                    alt="Person reading Summarist summaries"
                    width={400}
                    height={400}
                    priority
                  />
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section id="features">
          <div className="container">
            <div className="row">
              <h2 className="section__title">Understand books in few minutes</h2>
              <div className="features__wrapper">
                <div className="features">
                  <div className="features__icon">
                    <AiFillFileText />
                  </div>
                  <h3 className="features__title">Read or listen</h3>
                  <p className="features__sub--title">
                    Save time by getting the core ideas from the best books.
                  </p>
                </div>
                <div className="features">
                  <div className="features__icon">
                    <AiFillBulb />
                  </div>
                  <h3 className="features__title">Find your next read</h3>
                  <p className="features__sub--title">
                    Explore book lists and personalized recommendations.
                  </p>
                </div>
                <div className="features">
                  <div className="features__icon">
                    <AiFillAudio />
                  </div>
                  <h3 className="features__title">Briefcasts</h3>
                  <p className="features__sub--title">
                    Gain valuable insights from briefcasts.
                  </p>
                </div>
              </div>

              <div className="statistics__wrapper">
                <div className="statistics__content--header">
                  {headerBenefits.map((benefit) => (
                    <div className="statistics__heading" key={benefit}>
                      {benefit}
                    </div>
                  ))}
                </div>
                <div className="statistics__content--details">
                  <div className="statistics__data">
                    <div className="statistics__data--number">93%</div>
                    <div className="statistics__data--title">
                      of Summarist members <b>significantly increase</b> reading
                      frequency.
                    </div>
                  </div>
                  <div className="statistics__data">
                    <div className="statistics__data--number">96%</div>
                    <div className="statistics__data--title">
                      of Summarist members <b>establish better</b> habits.
                    </div>
                  </div>
                  <div className="statistics__data">
                    <div className="statistics__data--number">90%</div>
                    <div className="statistics__data--title">
                      have made <b>significant positive</b> change to their
                      lives.
                    </div>
                  </div>
                </div>
              </div>

              <div className="statistics__wrapper">
                <div className="statistics__content--details statistics__content--details-second">
                  <div className="statistics__data">
                    <div className="statistics__data--number">91%</div>
                    <div className="statistics__data--title">
                      of Summarist members{" "}
                      <b>report feeling more productive</b> after incorporating
                      the service into their daily routine.
                    </div>
                  </div>
                  <div className="statistics__data">
                    <div className="statistics__data--number">94%</div>
                    <div className="statistics__data--title">
                      of Summarist members have <b>noticed an improvement</b> in
                      their overall comprehension and retention of information.
                    </div>
                  </div>
                  <div className="statistics__data">
                    <div className="statistics__data--number">88%</div>
                    <div className="statistics__data--title">
                      of Summarist members <b>feel more informed</b> about
                      current events and industry trends since using the
                      platform.
                    </div>
                  </div>
                </div>
                <div className="statistics__content--header statistics__content--header-second">
                  {secondBenefits.map((benefit) => (
                    <div className="statistics__heading" key={benefit}>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="reviews">
          <div className="container">
            <div className="row">
              <h2 className="section__title">What our members say</h2>
              <div className="reviews__wrapper">
                {reviews.map((review) => (
                  <article className="review" key={review.name}>
                    <div className="review__header">
                      <div className="review__name">{review.name}</div>
                      <div className="review__stars">
                        <BsStarFill />
                      </div>
                    </div>
                    <div className="review__body">{review.body}</div>
                  </article>
                ))}
              </div>
              <div className="reviews__btn--wrapper">
                <button
                  className="btn home__cta--btn"
                  onClick={handlePrimaryAction}
                  type="button"
                >
                  {userLabel ? "Continue reading" : "Login"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="numbers">
          <div className="container">
            <div className="row">
              <h2 className="section__title">Start growing with Summarist now</h2>
              <div className="numbers__wrapper">
                <div className="numbers">
                  <div className="numbers__icon">
                    <BiCrown />
                  </div>
                  <div className="numbers__title">3 Million</div>
                  <div className="numbers__sub--title">
                    Downloads on all platforms
                  </div>
                </div>
                <div className="numbers">
                  <div className="numbers__icon numbers__star--icon">
                    <BsStarFill />
                    <BsStarHalf />
                  </div>
                  <div className="numbers__title">4.5 Stars</div>
                  <div className="numbers__sub--title">
                    Average ratings on iOS and Google Play
                  </div>
                </div>
                <div className="numbers">
                  <div className="numbers__icon">
                    <RiLeafLine />
                  </div>
                  <div className="numbers__title">97%</div>
                  <div className="numbers__sub--title">
                    Of Summarist members create a better reading habit
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer">
        <div className="container">
          <div className="row">
            <div className="footer__top--wrapper">
              {footerGroups.map((group) => (
                <div className="footer__block" key={group.title}>
                  <div className="footer__link--title">{group.title}</div>
                  <div>
                    {group.links.map((link) => (
                      <div className="footer__link--wrapper" key={link}>
                        <a className="footer__link">{link}</a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="footer__copyright--wrapper">
              <div className="footer__copyright">
                Copyright &copy; 2023 Summarist.
              </div>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={isAuthModalOpen}
        mode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onModeChange={setAuthMode}
      />
    </>
  );
}
