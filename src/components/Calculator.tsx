import * as React from "react";
import styled from "styled-components";
import YesNoButton from "./YesNoButton";
import Labels from "./Labels";
import calculateFloodlabel from "../calculateLabel";
import QuestionMarkIcon from "./icons/QuestionMark";

interface Props {
  label_score: number;
  pluvial_score: number;
  fluvial_score: number;
  groundwater_score: number;
  sewage_score: number;
  handleCancel: Function;
  handleSubmit: Function;
  old_floodlabel: null | "A" | "B" | "C" | "D" | "E";
}

type Question = {
  id: number;
  question: React.ReactElement;
  answer: boolean | null;
};

interface State {
  showModal: boolean;
  section: "fluval_pluvial" | "groundwater" | "sewage";
  fluvial_pluvial_questions: Question[];
  groundwater_questions: Question[];
  sewage_questions: Question[];
  new_floodlabel: null | "A" | "B" | "C" | "D" | "E";
  fluvial_label: null | string;
  fluvial_score: null | number;
  pluvial_label: null | string;
  pluvial_score: null | number;
  sewage_label: null | string;
  sewage_score: null | number;
  groundwater_label: null | string;
  groundwater_score: null | number;
}

const CalculatorWrapper = styled.div`
  background-color: #ffffff;
  box-shadow: 0px 5px 7px 1px rgba(0, 0, 0, 0.13);
  padding: 34px;
  width: 100%;
  margin: 24px;
`;

const ModalWrapper = styled.div`
  display: flex;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(2px) brightness(50%);
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  width: calc(100% - 230px);
  padding: 30px;
  height: 420px;
  background-color: #fff;
  border-radius: 22px;
  box-shadow: 0px 5px 7px 1px rgba(0, 0, 0, 0.13);
`;

const Questions = styled.div`
  display: flex;
  flex-direction: column;
`;
const Question = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 6px 0 6px 0;
`;

const ControlButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 50px 0 12px 0;
`;

const CancelButton = styled.button`
  box-shadow: 0px 5px 7px 1px rgba(0, 0, 0, 0.13);
  font-weight: 600;
  background-color: #a4a2a5;
  color: #ffffff;
  border-radius: 10px;
  font-size: 1.2em;
  width: 140px;
  height: 48px;
  cursor: pointer;
`;

const NextButton = styled.button`
  box-shadow: 0px 5px 7px 1px rgba(0, 0, 0, 0.13);
  font-weight: 600;
  background-color: #268ba0;
  color: #ffffff;
  border-radius: 10px;
  font-size: 1.2em;
  width: 294px;
  height: 48px;
  cursor: pointer;
`;

const DoneButton = styled.button`
  box-shadow: 0px 5px 7px 1px rgba(0, 0, 0, 0.13);
  font-weight: 600;
  background-color: #268ba0;
  color: #ffffff;
  border-radius: 10px;
  font-size: 1.2em;
  width: 294px;
  height: 48px;
  text-transform: uppercase;
  cursor: pointer;
`;

const Callout = styled.div`
  background-color: #eaf9ff;
  border: 2px solid #167c9b;
  width: 200px;
  min-height: 100px;
  padding: 20px;
  font-weight: 600;
`;

const lookupTableFluvial: any = {
  1: {
    yes: -5,
    no: 0
  },
  2: {
    yes: -5,
    no: 0
  },
  3: {
    yes: -5,
    no: 0
  },
  4: {
    yes: -5,
    no: 0
  },
  5: {
    yes: -5,
    no: 0
  }
};

const lookupTablePluvial: any = {
  1: {
    yes: -15,
    no: 0
  },
  2: {
    yes: 0,
    no: 0
  },
  3: {
    yes: -5,
    no: 0
  },
  4: {
    yes: 0,
    no: 0
  },
  5: {
    yes: -5,
    no: 0
  }
};

const lookupTableGroundwater: any = {
  1: {
    yes: 15,
    no: 0
  },
  2: {
    yes: -5,
    no: 0
  },
  3: {
    yes: -5,
    no: 0
  },
  4: {
    yes: -5,
    no: 0
  }
};

const lookupTableSewage: any = {
  1: {
    yes: -10,
    no: 10
  }
};

class Calculator extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      new_floodlabel: null,
      showModal: false,
      section: "fluval_pluvial",
      groundwater_label: null,
      groundwater_score: null,
      sewage_label: null,
      sewage_score: null,
      pluvial_label: null,
      pluvial_score: null,
      fluvial_label: null,
      fluvial_score: null,
      fluvial_pluvial_questions: [
        {
          id: 1,
          question: (
            <>
              <span>
                Is de begane grond van uw woning verhoogd (bijvoorbeeld op
                palen)?{" "}
                <QuestionMarkIcon
                  content={
                    <Callout>
                      Wanneer de voordeur van uw woning ongeveer 15 cm hoger
                      ligt dan het straatniveau, door bijvoorbeeld{" "}
                      <a
                        onClick={e => e.stopPropagation()}
                        href="http://wonen-interieur.com/wp-content/verhoging-tuin-e1520171202264.png"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        een opstapje
                      </a>{" "}
                      of{" "}
                      <a
                        onClick={e => e.stopPropagation()}
                        href="https://s3-eu-west-1.amazonaws.com/static-sr.s3.werkspot.nl/c21931b9-e30b-4a93-99d3-6907e1e3661d.jpg"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        aflopend aangelegde voortuin
                      </a>
                      , zal het water bij hevige regenval of een
                      rivieroverstroming minder snel uw woning binnendringen.
                    </Callout>
                  }
                />
              </span>
            </>
          ),
          answer: null
        },
        {
          id: 2,
          question: (
            <>
              <span>
                Zijn er rondom uw woning vaste verhogingen aanwezig
                (bijvoorbeeld een glazen of betonnen verhoging van een kade
                nabij water)?{" "}
                <QuestionMarkIcon
                  content={
                    <Callout>
                      Wanneer uw woning dichtbij een rivier of open water ligt,
                      kan een vaste verhoging in de buurt van uw huis de
                      wateroverlast uitstellen of beperken. Denk bijvoorbeeld
                      aan een{" "}
                      <a
                        onClick={e => e.stopPropagation()}
                        href="http://www.floodcontrolinternational.com/PRODUCTS/FLOOD-BARRIERS/Resources/Glass-flood-wall-LittleH-2c.jpg"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        glazen wand
                      </a>{" "}
                      of{" "}
                      <a
                        onClick={e => e.stopPropagation()}
                        href="https://www.tspr.org/sites/wium/files/styles/x_large/public/201810/photo-burlington-riverfront_1.jpg"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        betonnen verhoging
                      </a>{" "}
                      van een kade nabij water.
                    </Callout>
                  }
                />
              </span>
            </>
          ),
          answer: null
        },
        {
          id: 3,
          question: (
            <>
              <p>
                Zijn er in uw woning vaste deurbarrières aanwezig (bijvoorbeeld
                een waterdichte metalen deur)?
              </p>
            </>
          ),
          answer: null
        },
        {
          id: 4,
          question: (
            <>
              <p>
                Zijn er bij uw woning mobiele barrières aanwezig (bijvoorbeeld
                verplaatsbare hardplastic schotten of opblaasbare buizen)?
              </p>
            </>
          ),
          answer: null
        },
        {
          id: 5,
          question: (
            <>
              <p>
                Zijn de openingen van uw woning (ramen, deuren, keldermuren)
                geseald met waterdicht materiaal?
              </p>
            </>
          ),
          answer: null
        }
      ],
      groundwater_questions: [
        {
          id: 1,
          question: (
            <>
              <p>Is er een kelder onder uw woning?</p>
            </>
          ),
          answer: null
        },
        {
          id: 2,
          question: (
            <>
              <p>Zijn er waterbestendige (‘gesealde’) muren in de kelder?</p>
            </>
          ),
          answer: null
        },
        {
          id: 3,
          question: (
            <>
              <span>
                Zijn er in de kelder vaste deurbarrières aanwezig (bijvoorbeeld
                een waterdichte metalen deur)?{" "}
                <QuestionMarkIcon
                  content={
                    <Callout>
                      In het geval van opkomend grondwater kunnen vaste
                      deurbarrières, bijvoorbeeld een{" "}
                      <a
                        onClick={e => e.stopPropagation()}
                        href="http://emeralddoorsnyc.com/images/cellar/1.jpg"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        waterdichte metalen deur
                      </a>
                      , helpen om uw kelder vrij te houden van wateroverlast.
                    </Callout>
                  }
                />
              </span>
            </>
          ),
          answer: null
        },
        {
          id: 4,
          question: (
            <>
              <p>
                Zijn er in de kelder waterbestendige vloeren (bijvoorbeeld van
                beton)?
              </p>
            </>
          ),
          answer: null
        }
      ],
      sewage_questions: [
        {
          id: 1,
          question: (
            <>
              <p>Is er een terugslagklep geïnstalleerd?</p>
            </>
          ),
          answer: null
        }
      ]
    };
    this.handleCalculateLabel = this.handleCalculateLabel.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeydown, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeydown, false);
  }

  handleKeydown(e: any) {
    const { handleCancel } = this.props;
    if (e.keyCode === 27) {
      handleCancel();
    }
  }

  handleCalculateLabel() {
    const {
      fluvial_pluvial_questions,
      groundwater_questions,
      sewage_questions
    } = this.state;

    const { label_score } = this.props;

    const fluvial_score = fluvial_pluvial_questions.reduce(
      (total, currentValue) => {
        const val =
          currentValue.answer === true
            ? lookupTableFluvial[currentValue.id].yes
            : lookupTableFluvial[currentValue.id].no;
        return total + val;
      },
      0
    );

    const pluvial_score = fluvial_pluvial_questions.reduce(
      (total, currentValue) => {
        const val =
          currentValue.answer === true
            ? lookupTablePluvial[currentValue.id].yes
            : lookupTablePluvial[currentValue.id].no;
        return total + val;
      },
      0
    );

    const groundwater_score = groundwater_questions.reduce(
      (total, currentValue) => {
        const val =
          currentValue.answer === true
            ? lookupTableGroundwater[currentValue.id].yes
            : lookupTableGroundwater[currentValue.id].no;
        return total + val;
      },
      0
    );

    const sewage_score = sewage_questions.reduce((total, currentValue) => {
      const val =
        currentValue.answer === true
          ? lookupTableSewage[currentValue.id].yes
          : lookupTableSewage[currentValue.id].no;
      return total + val;
    }, 0);

    const total_score =
      label_score +
      fluvial_score +
      pluvial_score +
      groundwater_score +
      sewage_score;

    const fluvial_label = calculateFloodlabel(fluvial_score, 0, 20);
    const pluvial_label = calculateFloodlabel(pluvial_score, 0, 20);
    const groundwater_label = calculateFloodlabel(groundwater_score, 0, 20);
    const sewage_label = calculateFloodlabel(sewage_score, 0, 20);
    const total_label: any = calculateFloodlabel(total_score, 0, 100);

    // console.log("-------------------------");
    // console.log("old label", this.props.old_floodlabel);
    // console.log("fluvial", fluvial_score, fluvial_label);
    // console.log("pluvial", pluvial_score, pluvial_label);
    // console.log("groundwater", groundwater_score, groundwater_label);
    // console.log("sewage", sewage_score, sewage_label);
    // console.log("total", total_score, total_label);

    this.setState({
      fluvial_label,
      fluvial_score,
      groundwater_label,
      groundwater_score,
      new_floodlabel: total_label.toUpperCase(),
      pluvial_label,
      pluvial_score,
      sewage_label,
      sewage_score,
      showModal: true
    });
  }

  renderSection() {
    const {
      section,
      fluvial_pluvial_questions,
      groundwater_questions,
      sewage_questions
    } = this.state;

    const { handleCancel } = this.props;

    switch (section) {
      case "fluval_pluvial":
        return (
          <>
            <h1 style={{ fontWeight: 300 }}>
              Hoe is uw woning beschermd tegen <strong>hevige regenval</strong>{" "}
              en <strong>rivieroverstroming</strong>?
            </h1>
            <Questions>
              {fluvial_pluvial_questions.map(q => {
                return (
                  <Question key={q.id}>
                    {q.question}
                    <YesNoButton
                      answer={q.answer}
                      onChange={(answer: boolean) => {
                        this.setState({
                          fluvial_pluvial_questions: fluvial_pluvial_questions.map(
                            fpq => {
                              if (fpq.id === q.id) {
                                fpq.answer = answer;
                                return fpq;
                              }
                              return fpq;
                            }
                          )
                        });
                      }}
                    />
                  </Question>
                );
              })}
            </Questions>
            <ControlButtons>
              <CancelButton onClick={() => handleCancel()}>
                Annuleren
              </CancelButton>
              <NextButton
                onClick={() => this.setState({ section: "groundwater" })}
              >
                Volgende
              </NextButton>
            </ControlButtons>
          </>
        );

      case "groundwater":
        return (
          <>
            <h1 style={{ fontWeight: 300 }}>
              Hoe is uw woning beschermd tegen{" "}
              <strong>opkomend grondwater</strong>?
            </h1>
            <Questions>
              {groundwater_questions.map(q => {
                return (
                  <Question key={q.id}>
                    {q.question}
                    <YesNoButton
                      answer={q.answer}
                      onChange={(answer: boolean) => {
                        this.setState({
                          groundwater_questions: groundwater_questions.map(
                            gq => {
                              if (gq.id === q.id) {
                                gq.answer = answer;
                                return gq;
                              }
                              return gq;
                            }
                          )
                        });
                      }}
                    />
                  </Question>
                );
              })}
            </Questions>
            <ControlButtons>
              <CancelButton onClick={() => handleCancel()}>
                Annuleren
              </CancelButton>
              <NextButton onClick={() => this.setState({ section: "sewage" })}>
                Volgende
              </NextButton>
            </ControlButtons>
          </>
        );

      case "sewage":
        return (
          <>
            <h1 style={{ fontWeight: 300 }}>
              Hoe is uw woning beschermd tegen{" "}
              <strong>opkomend rioolwater</strong>?
            </h1>
            <Questions>
              {sewage_questions.map(q => {
                return (
                  <Question key={q.id}>
                    {q.question}
                    <YesNoButton
                      answer={q.answer}
                      onChange={(answer: boolean) => {
                        this.setState({
                          sewage_questions: sewage_questions.map(sq => {
                            if (sq.id === q.id) {
                              sq.answer = answer;
                              return sq;
                            }
                            return sq;
                          })
                        });
                      }}
                    />
                  </Question>
                );
              })}
            </Questions>
            <ControlButtons>
              <CancelButton onClick={() => handleCancel()}>
                Annuleren
              </CancelButton>
              <NextButton onClick={this.handleCalculateLabel}>
                Bereken mijn label opnieuw
              </NextButton>
            </ControlButtons>
          </>
        );

      default:
        console.error("No question selected");
        return <div />;
    }
  }

  render() {
    const {
      fluvial_label,
      fluvial_score,
      groundwater_label,
      groundwater_score,
      new_floodlabel,
      pluvial_label,
      pluvial_score,
      sewage_label,
      sewage_score,
      showModal
    } = this.state;
    const { handleSubmit, handleCancel, old_floodlabel } = this.props;

    return (
      <>
        {showModal ? (
          <ModalWrapper>
            <Modal>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly"
                }}
              >
                <div>
                  <h2>Oud label</h2>
                  <Labels activeLabel={old_floodlabel} />
                </div>
                <div>
                  <h2>Nieuw label</h2>
                  <Labels activeLabel={new_floodlabel} />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  textAlign: "center"
                }}
              >
                <p
                  style={{
                    fontWeight: 600
                  }}
                >
                  {new_floodlabel! &&
                  old_floodlabel! &&
                  new_floodlabel! < old_floodlabel!
                    ? "U heeft uw label verbeterd!"
                    : null}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  textAlign: "center"
                }}
              >
                <DoneButton
                  onClick={() => {
                    handleSubmit({
                      fluvial_label,
                      fluvial_score,
                      groundwater_label,
                      groundwater_score,
                      new_floodlabel,
                      pluvial_label,
                      pluvial_score,
                      sewage_label,
                      sewage_score
                    });
                    handleCancel();
                  }}
                >
                  Naar overzicht
                </DoneButton>
              </div>
            </Modal>
          </ModalWrapper>
        ) : null}
        <CalculatorWrapper>{this.renderSection()}</CalculatorWrapper>
      </>
    );
  }
}

export default Calculator;
