import * as React from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { RouteComponentProps } from "react-router-dom";
import { ActivityIndicator } from "react-native-web";
import centroid from "@turf/centroid";
import * as GeoJSONType from "geojson";

import ErrorBoundary from "./ErrorBoundary";
import Calculator from "./Calculator";
import Labels from "./Labels";
import Label from "./Label";
import House from "./House";
import MiniMap from "./MiniMap";
import RioolIcon from "./icons/Riool";
import GrondwaterIcon from "./icons/Grondwater";
import RivierIcon from "./icons/Rivier";
import NeerslagIcon from "./icons/Neerslag";
// import WaterbestendigeDeur from "./images/waterbestendige-deur.png";
// import TerugslagKlep from "./images/terugslagklep.png";
import addBaseUrlToApiCall from "./../utils/getUrl";

interface MatchParams {
  postcode: string;
  huisnr: string;
  huisletter: string;
  toevoeging: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

interface State {
  error: boolean;
  calculator_section: "fluval_pluvial" | "groundwater" | "sewage";
  fluvial_label: null | "A" | "B" | "C" | "D" | "E";
  fluvial_score: null | number;
  fluvial_value: null | number;
  feature: GeoJSONType.Feature;
  groundwater_label: null | "A" | "B" | "C" | "D" | "E";
  groundwater_score: null | number;
  groundwater_value: null | number;
  sewage_label: null | "A" | "B" | "C" | "D" | "E";
  sewage_score: null | number;
  sewage_value: null | number;
  huisnr: null | number;
  huisletter: null | string;
  label_score: null | number;
  label: null | "A" | "B" | "C" | "D" | "E";
  loading: boolean;
  pluvial_label: null | "A" | "B" | "C" | "D" | "E";
  pluvial_score: null | number;
  pluvial_value: null | number;
  postcode: null | string;
  stad: null | string;
  straatnaam: null | string;
  toevoeging: null | string;
  showPage: "result" | "calculate" | "moreinfo" | "measures";
}

const LABELTYPE_UUID = "e23c58ea-ae39-41bf-9867-021a996034b8";

const JumpToQuestionButton = styled.button`
  box-shadow: 0px 5px 7px 1px rgba(0, 0, 0, 0.13);
  font-weight: 600;
  background-color: #258ba0;
  color: #fff;
  border: 3px solid #258ba0;
  border-radius: 10px;
  font-size: 0.8em;
  width: 294px;
  height: 48px;
  margin: 4px;
  text-transform: uppercase;
  cursor: pointer;
`;

const NothingFound = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90vh;
  cursor: pointer;
`;

const Wrapper = styled.div`
  background-color: #f0fafe;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  background-color: #3884a3;
  padding: 12px 0 12px 0;
  color: #fff;
  font-size: 2em;
`;

const BackButton = styled.button`
  color: #fff;
  font-size: 1.2em;
  background-color: transparent;
  border: none;
  cursor: pointer;
  flex: 1;
`;

const Title = styled.div`
  position: relative;
  right: 20px;
  display: flex;
  text-align: center;
  color: #fff;
  font-size: 0.85em;
  font-weight: 400;
  flex: 10;
  justify-content: center;
`;

const IconsRow = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 10px 0 30px 0;
  @media (max-width: 768px) {
    height: inherit;
    max-width: 100px;
    min-width: 100px;
    flex-direction: column;
  }
`;

const Icon = styled.div`
  font-weight: 500;
  flex: 0.2;
  height: 100px;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 18px 0 0 0;
  padding: 10px;
  min-width: 100px;
  max-width: 100px;
`;

const BlueTile = styled.div`
  display: flex;
  flex: 1;
  min-height: 200px;
  background-color: #006c8d;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
  border: 5px solid #0085ab;
  cursor: pointer;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px;
  margin: 20px;
  @media (max-width: 768px) {
    height: inherit;
    flex-direction: column;
  }
`;

const Tile = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  margin: 20px;
  padding: 20px;
  box-shadow: 0px 5px 7px 1px rgba(0, 0, 0, 0.13);
`;

// const Afbeelding = styled.div<{ image: any | null }>`
//   min-width: 160px;
//   min-height: 160px;
//   width: 160px;
//   height: 160px;
//   border: 1px solid #ccc;
//   margin: 20px 20px 20px 0;
//   background-image: url('${props => props.image}');
//   background-size: cover;
// `;

const Advies = styled.div`
  padding: 20px;
`;

const Measures = styled.div`
  display: flex;
  flex-direction: column;
`;
const Measure = styled.div`
  display: flex;
  flex-direction: row;
  margin: 20px 0 20px 0;
`;
const MeasureIcon = styled.div`
  width: 90px;
  min-width: 90px;
  margin: 0 20px 0 20px;
`;
const MeasureText = styled.div``;
const MeasureTextHeader = styled.h4`
  margin: 0;
  color: #0e7296;
`;
const MeasureTextParagraph = styled.p``;

class Result extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      calculator_section: "fluval_pluvial",
      error: false,
      fluvial_label: null,
      fluvial_score: null,
      fluvial_value: null,
      feature: {
        type: "Feature",
        geometry: {
          coordinates: [],
          type: "Polygon"
        },
        properties: []
      },
      groundwater_label: null,
      groundwater_score: null,
      groundwater_value: null,
      huisnr: null,
      huisletter: null,
      label_score: null,
      label: null,
      loading: true,
      pluvial_label: null,
      pluvial_score: null,
      pluvial_value: null,
      postcode: null,
      showPage: "result",
      stad: null,
      straatnaam: null,
      toevoeging: null,
      sewage_score: 5,
      sewage_value: null,
      sewage_label: "B"
    };
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const { match } = this.props;
    // Add Base Url to the api call if you are on staging or production.
    var baseUrl = addBaseUrlToApiCall();

    const { postcode, huisnr, toevoeging } = match.params;
    if (postcode && huisnr) {
      let addressApiUrl = `${baseUrl}/api/v3/buildings/?addresses__postalcode=${postcode
        .replace(" ", "")
        .toUpperCase()}`;

      const huisnr_regex = huisnr.match(/\d+/);
      const huisletter_regex = huisnr.match(/[A-Za-z]/);
      let _huisnr;
      let _huisletter;

      if (huisnr_regex) {
        _huisnr = parseInt(huisnr_regex[0]);
      }

      if (huisletter_regex) {
        _huisletter = huisletter_regex[0].toUpperCase();
      }

      if (_huisletter) {
        addressApiUrl += `&addresses__house_letter=${_huisletter}`;
      }
      if (toevoeging) {
        addressApiUrl += `&addresses__house_number_suffix=${toevoeging}`;
      }

      addressApiUrl += `&addresses__house_number=${_huisnr}`;
      const addressResults = await fetch(addressApiUrl)
        .then(response => {
          return response.json();
        })
        .then(json => {
          return json.results;
        });

      if (addressResults.length > 0) {
        const labelResults = await fetch(
          `${baseUrl}/api/v3/labeltypes/${LABELTYPE_UUID}/compute/?object_id=${addressResults[0].id}`
        )
          .then(response => {
            if (!response.ok) {
              return false;
            }
            return response.json();
          })
          .then(json => {
            return json;
          })
          .catch(error => console.log(error));

        if (labelResults) {
          this.setState({
            fluvial_label: labelResults.extra.fluvial_label,
            fluvial_score: labelResults.extra.fluvial_score,
            fluvial_value: labelResults.extra.fluvial_value,
            feature: addressResults[0].geometry,
            groundwater_label: labelResults.extra.groundwater_label,
            groundwater_score: labelResults.extra.groundwater_score,
            groundwater_value: labelResults.extra.groundwater_value,
            huisnr: addressResults[0].addresses[0].house_number,
            huisletter: addressResults[0].addresses[0].house_letter,
            label_score: labelResults.extra.label_score,
            label: labelResults.label_value,
            loading: false,
            error: false,
            pluvial_label: labelResults.extra.pluvial_label,
            pluvial_score: labelResults.extra.pluvial_score,
            pluvial_value: labelResults.extra.pluvial_value,
            postcode: addressResults[0].addresses[0].postalcode,
            sewage_score: labelResults.extra.sewage_score,
            sewage_label: labelResults.extra.sewage_label,
            stad: addressResults[0].addresses[0].city,
            straatnaam: addressResults[0].addresses[0].street,
            toevoeging: addressResults[0].addresses[0].house_number_suffix
          });
        } else {
          this.setState({
            error: true,
            loading: false
          });
        }
      } else {
        this.setState({
          error: true,
          loading: false
        });
      }
    }
  }

  render() {
    const {
      loading,
      straatnaam,
      huisnr,
      toevoeging,
      postcode,
      stad,
      showPage,
      feature,
      label,
      label_score,
      error,
      fluvial_label,
      fluvial_score,
      pluvial_label,
      pluvial_score,
      groundwater_label,
      groundwater_score,
      sewage_score,
      sewage_label
    } = this.state;
    const { history } = this.props;

    if (error) {
      return (
        <NothingFound
          onClick={() => {
            history.push({
              pathname: "/",
              search: ""
            });
          }}
        >
          <h1>Niets gevonden!</h1>
          <p>Probeer het opnieuw</p>
        </NothingFound>
      );
    }

    if (loading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            position: "absolute"
          }}
        >
          <ActivityIndicator />
        </div>
      );
    }

    const header = (
      <Header>
        <BackButton
          onClick={() => {
            const { showPage } = this.state;
            if (showPage === "result") {
              history.push({
                pathname: "/",
                search: ""
              });
            } else {
              this.setState({ showPage: "result" });
            }
          }}
        >
          &larr;
        </BackButton>
        <Title>
          {straatnaam} {huisnr}
          {toevoeging}, {postcode}, {stad}
        </Title>
      </Header>
    );

    const centre = centroid(feature);

    switch (showPage) {
      case "calculate":
        return (
          <Wrapper>
            {header}
            <Row>
              <Calculator
                setCalculatorSection={(section: any) => {
                  this.setState({
                    calculator_section: section
                  });
                }}
                handleSubmit={(newLabelAndScores: any) => {
                  this.setState({
                    fluvial_label: newLabelAndScores.fluvial_label.toUpperCase(),
                    fluvial_score: newLabelAndScores.fluvial_score,
                    groundwater_label: newLabelAndScores.groundwater_label.toUpperCase(),
                    groundwater_score: newLabelAndScores.groundwater_score,
                    label: newLabelAndScores.new_floodlabel.toUpperCase(),
                    pluvial_label: newLabelAndScores.pluvial_label.toUpperCase(),
                    pluvial_score: newLabelAndScores.pluvial_score,
                    sewage_label: newLabelAndScores.sewage_label.toUpperCase(),
                    sewage_score: newLabelAndScores.sewage_score
                  });
                }}
                calculator_section={this.state.calculator_section}
                handleCancel={() => this.setState({ showPage: "result" })}
                label_score={label_score || 0}
                pluvial_score={pluvial_score || 0}
                fluvial_score={fluvial_score || 0}
                sewage_score={sewage_score || 0}
                groundwater_score={groundwater_score || 0}
                old_floodlabel={label}
              />
            </Row>
          </Wrapper>
        );

      case "moreinfo":
        return (
          <Wrapper>
            {header}
            <Row>
              <div
                style={{
                  backgroundColor: "#fff",
                  width: "100%",
                  boxShadow: "0px 5px 7px 1px rgba(0, 0, 0, 0.13)",
                  borderRadius: 6,
                  padding: 20
                }}
              >
                <p
                  style={{
                    fontWeight: 800,
                    color: "#258BA0"
                  }}
                >
                  Het Floodlabel wordt berekend aan de hand van verschillende
                  risico categorieën. Deze worden hieronder uitgelegd.
                </p>
                <Measures>
                  <Measure>
                    <MeasureIcon>
                      <NeerslagIcon />
                    </MeasureIcon>
                    <MeasureText>
                      <MeasureTextHeader>
                        Risico's van hevige neerslag
                      </MeasureTextHeader>
                      <MeasureTextParagraph>
                        Het risico van uw woning voor hevige regenval wordt
                        bepaald door te kijken naar of uw woning in een
                        laaggelegen gebied of op een helling ligt. Hoe hoger
                        gelegen, hoe beter uw label is. Naast de ligging van uw
                        woning zijn er nog andere woning gebonden factoren, die
                        uw label kunnen beïnvloeden. Klik door naar de volgende
                        pagina om uw label te specificeren naar uw persoonlijke
                        situatie.
                      </MeasureTextParagraph>
                    </MeasureText>
                  </Measure>

                  <Measure>
                    <MeasureIcon>
                      <GrondwaterIcon />
                    </MeasureIcon>
                    <MeasureText>
                      <MeasureTextHeader>
                        Risico's van opkomend grondwater
                      </MeasureTextHeader>
                      <MeasureTextParagraph>
                        Het risico van uw woning voor opkomend grondwater wordt
                        bepaald door te kijken naar het verschil tussen de
                        grondwaterstand en de laagste vloerhoogte van uw woning
                        (dat wil zeggen, straatniveau of, indien aanwezig,
                        kelderniveau). U kunt dit zelf specificeren door op de
                        volgende pagina enkele vragen te beantwoorden. Daarmee
                        wordt uw label aangepast naar uw persoonlijke situatie.
                      </MeasureTextParagraph>
                    </MeasureText>
                  </Measure>

                  <Measure>
                    <MeasureIcon>
                      <RivierIcon />
                    </MeasureIcon>
                    <MeasureText>
                      <MeasureTextHeader>
                        Risico's van overstromende rivieren
                      </MeasureTextHeader>
                      <MeasureTextParagraph>
                        Het label van uw woning voor rivier overstromingen wordt
                        bepaald door de maximale waterdiepte. Dit komt overeen
                        met het scenario van de ergst denkbare overstroming in
                        Nederland. Uw woning wordt beschermd door waterkeringen
                        zoals dijken. De hoogte en sterkte van de waterkeringen
                        hebben invloed op de kans dat uw woning overstroomt als
                        gevolg van een rivieroverstroming. Daarnaast wordt uw
                        label beïnvloed door of uw woning hoger of lager gelegen
                        is. Naast de ligging van uw woning zijn er nog andere,
                        woning gebonden factoren die uw label kunnen
                        beïnvloeden. Klik door naar de volgende pagina om uw
                        label te specificeren naar uw persoonlijke situatie.
                      </MeasureTextParagraph>
                    </MeasureText>
                  </Measure>

                  <Measure>
                    <MeasureIcon>
                      <RioolIcon />
                    </MeasureIcon>
                    <MeasureText>
                      <MeasureTextHeader>
                        Risico's van opkomend water via riolering
                      </MeasureTextHeader>
                      <MeasureTextParagraph>
                        Het risico van uw woning voor terugkomend water via het
                        riool wordt bepaald door te kijken naar het type
                        rioolaansluiting. Daarnaast wordt het risico bepaald
                        door te kijken naar aanwezigheid van geïnstalleerde
                        maatregelen, zoals een terugslagklep. U kunt dit
                        aangeven op de volgende pagina. Hiermee wordt uw label
                        aangepast naar uw persoonlijke situatie.
                      </MeasureTextParagraph>
                    </MeasureText>
                  </Measure>
                </Measures>
              </div>
            </Row>
            <Row>
              <BlueTile onClick={() => this.setState({ showPage: "moreinfo" })}>
                Ik wil meer weten over het Floodlabel van mijn woning
              </BlueTile>
              <BlueTile
                onClick={() => this.setState({ showPage: "calculate" })}
              >
                Pas het label aan met kenmerken van mijn woning
              </BlueTile>
              <BlueTile onClick={() => this.setState({ showPage: "measures" })}>
                Welke maatregelen kan ik nemen?
              </BlueTile>
            </Row>
          </Wrapper>
        );

      case "measures":
        return (
          <Wrapper>
            {header}
            <Row>
              <div
                style={{
                  backgroundColor: "#fff",
                  width: "100%",
                  boxShadow: "0px 5px 7px 1px rgba(0, 0, 0, 0.13)",
                  borderRadius: 6
                }}
              >
                <House />
              </div>
            </Row>

            <Row>
              <div
                style={{
                  backgroundColor: "#fff",
                  width: "100%",
                  boxShadow: "0px 5px 7px 1px rgba(0, 0, 0, 0.13)",
                  borderRadius: 6,
                  padding: 6,
                  display: "flex",
                  justifyContent: "space-evenly"
                }}
              >
                <Advies>
                  <h4 id="overleven-op-zolder">Overleven op zolder</h4>
                  <p>
                    In het geval van een grootschalige overstroming kan het zijn
                    dat u een paar dagen op uzelf bent aangewezen. Zorg daarom
                    dat er voldoende water en eten in huis. Wat u verder nodig
                    mogelijk heeft: medicatie, belangrijke papieren (bijv.
                    legitimatie), een radio op batterijen, zaklampen, kaarsen,
                    lucifers, warme dekens en droge kleren. In dien er geen
                    droge verdieping in uw huis is, zal u in de omgeving van uw
                    huis een droge verdieping moeten zoeken
                  </p>
                </Advies>
                {/* <Afbeelding image={null} /> */}
              </div>
            </Row>

            <Row>
              <div
                style={{
                  backgroundColor: "#fff",
                  width: "100%",
                  boxShadow: "0px 5px 7px 1px rgba(0, 0, 0, 0.13)",
                  borderRadius: 6,
                  padding: 6,
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <Advies>
                  <h4 id="spullen-van-waarde-boven-bewaren">
                    Spullen van (sentimentele) waarde boven bewaren
                  </h4>
                  <p>
                    Wanneer er kans is op een overstroming zorg er dan voor dat
                    u uw waardevolle spullen naar boven verplaatst.
                  </p>
                </Advies>
                {/* <Afbeelding image={null} /> */}
              </div>
            </Row>

            <Row>
              <div
                style={{
                  backgroundColor: "#fff",
                  width: "100%",
                  boxShadow: "0px 5px 7px 1px rgba(0, 0, 0, 0.13)",
                  borderRadius: 6,
                  padding: 6,
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <Advies>
                  <h4 id="voertuigen-verplaatsen">Voertuigen verplaatsen</h4>
                  <p>
                    Ter voorbereiding op een overstroming kunt u uw voertuigen
                    op een hogere locatie stallen zodat zij geen waterschade
                    krijgen. Ook wordt zo voorkomen dat voertuigen niet
                    meegesleurd worden door het water en schade aan gebouwen
                    veroorzaken.
                  </p>
                </Advies>
                {/* <Afbeelding image={null} /> */}
              </div>
            </Row>

            <Row>
              <div
                style={{
                  backgroundColor: "#fff",
                  width: "100%",
                  boxShadow: "0px 5px 7px 1px rgba(0, 0, 0, 0.13)",
                  borderRadius: 6,
                  padding: 6,
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <Advies>
                  <h4 id="waterbestendige-voordeur">
                    Waterbestendige voordeur
                  </h4>
                  <p>
                    Door het plaatsen van (verplaatsbare) waterschotten aan de
                    buitenkant van uw huis, kunt u het water buiten de deur
                    houden tot de hoogte van het schot. De schotten zijn gemaakt
                    van waterproof stalen frames en worden in een schacht
                    geplaatst die aan de kozijnen of muren gemonteerd worden. De
                    schotten moet u dan zelf in de frames plaatsen wanneer er
                    kans is op een overstroming. Dit is een relatief goedkope
                    manier om tijdens een overstroming het water zo lang
                    mogelijk buiten te houden. Een andere mogelijkheid is een
                    geheel waterdichte deur aan te schaffen. Die er voor zorgt
                    er voor dat het water niet via de buitendeuren naar binnen
                    komt.
                  </p>
                  <JumpToQuestionButton
                    onClick={() => {
                      this.setState({
                        showPage: "calculate",
                        calculator_section: "fluval_pluvial"
                      });
                    }}
                  >
                    Kies voor maatregel
                  </JumpToQuestionButton>
                </Advies>
                {/* <Afbeelding image={WaterbestendigeDeur} /> */}
              </div>
            </Row>

            <Row>
              <div
                style={{
                  backgroundColor: "#fff",
                  width: "100%",
                  boxShadow: "0px 5px 7px 1px rgba(0, 0, 0, 0.13)",
                  borderRadius: 6,
                  padding: 6,
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <Advies>
                  <h4 id="pomp-op-begane-grond">Pomp op de begane grond</h4>
                  <p>
                    Waterpompen worden geïnstalleerd op een laag punt in het
                    huis. Daar zal het water als eerste heen stromen en maakt
                    het daarom mogelijk om tijdig water weg te kunnen pompen.
                    Een pomp kan pas gebruikt worden als er water in het huis
                    staat en werkt daarom pas na of tijdens een overstroming.
                    Een waterpomp werkt op stroom en slaat automatisch aan
                    wanneer het onderwater staat. De kosten van een pomp zijn
                    afhankelijk van de capaciteit en grootte. Belangrijk is dat
                    het water niet uit het huis gepompt wordt als het water
                    buitenshuis nog stijgt, dan is het namelijk mogelijk dat de
                    muren instorten door de waterdruk van buitenaf.
                  </p>
                </Advies>
                {/* <Afbeelding image={null} /> */}
              </div>
            </Row>

            <Row>
              <div
                style={{
                  backgroundColor: "#fff",
                  width: "100%",
                  boxShadow: "0px 5px 7px 1px rgba(0, 0, 0, 0.13)",
                  borderRadius: 6,
                  padding: 6,
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <Advies>
                  <h4 id="keukenkasten-op-pootjes">Keukenkasten op pootjes</h4>
                  <p>
                    Wanneer keukenkasten en apparatuur op een hoogte van 10-15
                    cm geplaatst worden, kan de waterschade beperkt worden.
                  </p>
                </Advies>
                {/* <Afbeelding image={null} /> */}
              </div>
            </Row>

            <Row>
              <div
                style={{
                  backgroundColor: "#fff",
                  width: "100%",
                  boxShadow: "0px 5px 7px 1px rgba(0, 0, 0, 0.13)",
                  borderRadius: 6,
                  padding: 6,
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <Advies>
                  <h4 id="terugslagklep-in-riolering">
                    Terugslagklep in riolering
                  </h4>
                  <p>
                    Tijdens een overstroming, komt er veel water in het riool
                    terecht. Wanneer de riolering dit met zulke hoeveelheden
                    gebeurt dat het water niet snel genoeg afgevoerd kan worden,
                    kan het rioolwater via afvoerputjes en toiletten naar boven
                    komen. Om dit te voorkomen is het mogelijk een terugslagklep
                    te installeren in de rioolaansluiting van uw huis. De klep
                    zorgt er voor dat het water niet vanuit het riool uw huis
                    terug kan instromen en vermindert daarmee de kans op
                    rioolwaterschade.
                  </p>
                  <JumpToQuestionButton
                    onClick={() => {
                      this.setState({
                        showPage: "calculate",
                        calculator_section: "sewage"
                      });
                    }}
                  >
                    Kies voor maatregel
                  </JumpToQuestionButton>
                </Advies>
                {/* <Afbeelding image={TerugslagKlep}/> */}
              </div>
            </Row>

            <Row>
              <div
                style={{
                  backgroundColor: "#fff",
                  width: "100%",
                  boxShadow: "0px 5px 7px 1px rgba(0, 0, 0, 0.13)",
                  borderRadius: 6,
                  padding: 6,
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <Advies>
                  <h4 id="schuimisolatie-gesloten-cel">
                    Schuim isolatie met gesloten cel structuur
                  </h4>
                  <p>
                    Er zijn verschillende manieren om de binnenmuren van uw
                    woning waterbestendig te maken. De meest voorkomende
                    permanente maatregel is het aanbrengen van schuim isolatie
                    met gesloten cel structuur om de muren van uw woning beter
                    te beschermen tegen wateroverlast. Dit materiaal werkt
                    daarnaast ook brandwerend en thermisch isolerend. In het
                    geval van een overstroming zullen er nog steeds kosten zijn
                    voor het droog- en schoonmaken van uw huis, maar door deze
                    maatregel worden de aanvullende kosten van schadeherstel
                    beperkt.
                  </p>
                  <JumpToQuestionButton
                    onClick={() => {
                      this.setState({
                        showPage: "calculate",
                        calculator_section: "fluval_pluvial"
                      });
                    }}
                  >
                    Kies voor maatregel
                  </JumpToQuestionButton>
                </Advies>
              </div>
            </Row>

            <Row>
              <div
                style={{
                  backgroundColor: "#fff",
                  width: "100%",
                  boxShadow: "0px 5px 7px 1px rgba(0, 0, 0, 0.13)",
                  borderRadius: 6,
                  padding: 6,
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <Advies>
                  <h4 id="waterbestendige-stenen-vloer">
                    Waterbestendige stenen vloer
                  </h4>
                  <p>
                    In plaats van de vloer van uw woning te bedekken met karpet
                    of laminaat, kan ook gewerkt worden met een betegelde vloer.
                    Dit is een permanente maatregel om de overlast en schade van
                    water op de vloer van uw woning te beperken. Een stenen
                    vloer kan ook brandwerend en isolerend werken. Wanneer deze
                    maatregel gecombineerd wordt met een betonnen in plaats van
                    een houten ondervloer / fundering, wordt tevens de kans op
                    schade door opkomend grondwater kleiner.
                  </p>
                  <JumpToQuestionButton
                    onClick={() => {
                      this.setState({
                        showPage: "calculate",
                        calculator_section: "groundwater"
                      });
                    }}
                  >
                    Kies voor maatregel
                  </JumpToQuestionButton>
                </Advies>
              </div>
            </Row>

            <Row>
              <BlueTile onClick={() => this.setState({ showPage: "moreinfo" })}>
                Ik wil meer weten over het Floodlabel van mijn woning
              </BlueTile>
              <BlueTile
                onClick={() => this.setState({ showPage: "calculate" })}
              >
                Pas het label aan met kenmerken van mijn woning
              </BlueTile>
              <BlueTile onClick={() => this.setState({ showPage: "measures" })}>
                Welke maatregelen kan ik nemen?
              </BlueTile>
            </Row>
          </Wrapper>
        );

      default:
        return (
          <Wrapper>
            {header}
            <Row>
              <Tile style={{ flex: 2 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #f3f3f3"
                  }}
                >
                  <Labels activeLabel={label} />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      borderLeft: "1px solid #f3f3f3",
                      padding: "0 0 0 20px"
                    }}
                  >
                    <h1
                      style={{
                        fontSize: 20,
                        fontWeight: 500
                      }}
                    >
                      Floodlabel:{" "}
                      <span style={{ fontWeight: 600 }}>{label}</span>
                    </h1>
                    <p style={{ fontWeight: 600, lineHeight: 1.4 }}>
                      U bent goed beschermd tegen de meeste typen overstromingen
                      door de goede ligging van uw woning.
                    </p>
                    <p
                      style={{
                        fontWeight: 400,
                        lineHeight: 1.4,
                        fontSize: "0.9em",
                        fontStyle: "italic"
                      }}
                    >
                      Dit is een voorlopig label gebaseerd op openbare data over
                      de maximale waterdiepte per type overstroming. De kans dat
                      deze overstroming plaatsvindt is niet meegenomen in het
                      label. Klik verder om uw label aan te passen naar uw
                      woning en om te kijken wat u zelf kunt doen voor uw
                      veiligheid tegen water.
                    </p>
                  </div>
                </div>
                <IconsRow>
                  <Icon>
                    Neerslag
                    <NeerslagIcon />
                    <Label activeLabel={pluvial_label} />
                  </Icon>
                  <Icon>
                    Rivier
                    <RivierIcon />
                    <Label activeLabel={fluvial_label} />
                  </Icon>
                  <Icon>
                    Grondwater
                    <GrondwaterIcon />
                    <Label activeLabel={groundwater_label} />
                  </Icon>
                  <Icon>
                    Riool
                    <RioolIcon />
                    <Label activeLabel={sewage_label} />
                  </Icon>
                </IconsRow>
              </Tile>

              <Tile style={{ flex: 1.5 }}>
                <h1
                  style={{
                    fontSize: 20,
                    fontWeight: 500
                  }}
                >
                  Uw omgeving
                </h1>
                <ErrorBoundary>
                  <MiniMap feature={feature} center={centre} />
                </ErrorBoundary>
              </Tile>
            </Row>

            <Row>
              <BlueTile onClick={() => this.setState({ showPage: "moreinfo" })}>
                Ik wil meer weten over het Floodlabel van mijn woning
              </BlueTile>
              <BlueTile
                onClick={() =>
                  this.setState({
                    showPage: "calculate",
                    calculator_section: "fluval_pluvial"
                  })
                }
              >
                Pas het label aan met kenmerken van mijn woning
              </BlueTile>
              <BlueTile onClick={() => this.setState({ showPage: "measures" })}>
                Welke maatregelen kan ik nemen?
              </BlueTile>
            </Row>
          </Wrapper>
        );
    }
  }
}

export default withRouter(Result);
