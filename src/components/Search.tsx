import * as React from "react";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { ActivityIndicator } from "react-native-web";
import styled from "styled-components";
import MaskedField from "react-masked-field";

import nensLogo from "./logos/logo-nens.png";
import uuLogo from "./logos/logo-universiteit-utrecht.png";
import urbanEuropeLogo from "./logos/logo-urban-europe.png";
import addBaseUrlToApiCall from "./../utils/getUrl";

type PathParamsType = {};
type PropsType = RouteComponentProps<PathParamsType> & {};

interface State {
  height: number;
  postcode: null | string;
  huisnr_input: null | string;
  huisnr: null | number;
  huisletter: null | string;
  toevoeging: null | string;
  loading: boolean;
  error: null | boolean;
  errorMessage: null | string;
}

const LABELTYPE_UUID = "e23c58ea-ae39-41bf-9867-021a996034b8";

const Row = styled.div<{ height: number }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  height: ${props => props.height}px;
  background-color: #ebfaff;
  margin: 0;
  padding: 0;
  @media (max-width: 768px) {
    height: inherit;
    flex-direction: column;
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
  justify-content: space-between;
  position: relative;
  @media (max-width: 768px) {
    width: 100%;
    min-height: 500px;
  }
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
  background-image: url("/images/background-bucket-water.jpg");
  background-size: cover;
  background-position: center;
  @media (max-width: 768px) {
    width: 100%;
    min-height: 250px;
    display: none;
  }
`;

const Slogan = styled.h1`
  font-size: 2.2em;
  line-height: 50px;
  font-weight: 500;
  text-align: right;
`;

const SearchWrapper = styled.div`
  display: flex;
  justify-content: right;
  align-items: right;
  flex-direction: column;
  padding: 20px;
  margin-bottom: 100px;
`;

const SearchBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  align-items: flex-end;
`;

const SearchInput = styled.div`
  position: relative;
  display: flex;
  width: 300px;
  height: 100px;
  color: #748083;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
`;

const LogosBar = styled.div`
  background-color: #fff;
  padding: 20px;
  align-items: center;
  justify-content: space-between;
  display: flex;
  position: relative;
  overflow: hidden;
`;

const StartButton = styled.button<{ postcode: string; huisnr: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  min-height: 40px;
  color: #fff;
  background-color: #007d9b;
  border-radius: 14px;
  font-size: 1.2em;
  font-weight: 700;
  text-transform: uppercase;
  margin: 10px 0 0 0;
  cursor: ${props => (props.postcode && props.huisnr ? "pointer" : "default")};
  opacity: ${props => (props.postcode && props.huisnr ? 1 : 0.5)};
`;

const Table = styled.table`
  border-spacing: 12px;
  padding: 0;
  margin: 0;
  color: #333;
`;

const Tr = styled.tr`
  padding: 0;
  margin: 0;
`;

const Td = styled.td`
  padding: 0;
  margin: 0;
`;

const Input = styled.input`
  border: none;
  height: 25px;
  font-size: 1.1em;
  padding: 2px;
  width: 100%;
  border-radius: 2px;
`;

const Logo = styled.h1`
  font-size: 1.8em;
  font-weight: 400;
  margin-left: 20px;
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 150px;
  left: 10px;
  fontsize: 0.9em;
`;

class Search extends React.Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      error: false,
      errorMessage: null,
      height: window.innerHeight,
      huisnr_input: null,
      huisnr: null,
      huisletter: null,
      loading: false,
      postcode: null,
      toevoeging: null
    };
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowResize, false);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize, false);
  }

  handleWindowResize() {
    const { innerHeight } = window;
    this.setState({
      height: innerHeight
    });
  }

  handleClick(e: any) {
    const { postcode, huisnr, huisletter, toevoeging } = this.state;
    const { history } = this.props;
    if (postcode && huisnr) {
      // console.log("[dbg] handleClick", e);
      // console.log("[info]", postcode, huisnr, huisletter, toevoeging);
      // Add Base Url to the api call if you are on staging or production.
      var baseUrl = addBaseUrlToApiCall();

      this.setState(
        {
          loading: true,
          errorMessage: null
        },
        async () => {
          let addressApiUrl = `${baseUrl}/api/v3/buildings/?addresses__postalcode=${postcode
            .replace(" ", "")
            .toUpperCase()}&addresses__house_number=${huisnr}`;
          if (huisletter) {
            addressApiUrl += `&addresses__house_letter=${huisletter}`;
          }
          if (toevoeging) {
            addressApiUrl += `&addresses__house_number_suffix=${toevoeging}`;
          }

          const addressResults = await fetch(addressApiUrl)
            .then(response => {
              if (response.ok) {
                return response.json();
              }
              alert(`Foutmelding: ${response.statusText.toString()}`);
            })
            .then(json => {
              return json.results;
            })
            .catch(error => {
              console.error("Error fetching address", error);
              return [];
            });

          if (addressResults.length > 0) {
            const labelResults = await fetch(
              `${baseUrl}/api/v3/labeltypes/${LABELTYPE_UUID}/compute/?object_id=${addressResults[0].id}`
            )
              .then(response => {
                if (!response.ok) {
                  alert("Geen woning gevonden.");
                  this.setState({
                    loading: false
                  });
                  return false;
                }
                return response.json();
              })
              .then(json => {
                return json;
              })
              .catch(error => console.log(error));

            if (labelResults) {
              history.push({
                pathname: `/${postcode
                  .toUpperCase()
                  .replace(" ", "")}/${huisnr}`,
                search: ""
              });
            } else {
              console.warn("Error pushing to results page...");
            }
          } else {
            console.warn("No valid postcode/huisnr");
            this.setState({
              loading: false,
              errorMessage: "Geen geldige postcode/huisnummer combinatie."
            });
          }
        }
      );
    }
  }

  render() {
    const {
      errorMessage,
      height,
      postcode,
      huisnr_input,
      huisnr,
      toevoeging,
      loading
    } = this.state;

    return (
      <div>
        <Row id="row" height={height}>
          <Left id="left">
            <Logo>Floodlabel</Logo>
            <SearchWrapper>
              <Slogan>Hoe veilig ben ik tegen water?</Slogan>
              <SearchBox>
                <SearchInput>
                  <p style={{ margin: "10px 0 10px 0" }}>
                    Zoek hier naar uw woning
                  </p>

                  <Table>
                    <tbody>
                      <Tr>
                        <Td colSpan={1}>Postcode</Td>
                        <Td colSpan={3}>
                          <MaskedField
                            mask="9999 aa"
                            onComplete={postcode =>
                              this.setState({
                                postcode: postcode
                              })
                            }
                            onKeyUp={e => {
                              if (e.key === "Enter") {
                                this.handleClick(e);
                              }
                            }}
                            value={postcode ? postcode : ""}
                            autoFocus
                            style={{
                              width: "100%",
                              border: "none",
                              fontSize: "1.1em",
                              padding: 2,
                              borderRadius: 2,
                              textTransform: "uppercase"
                            }}
                          />
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Huisnr.</Td>
                        <Td>
                          <Input
                            type="text"
                            value={huisnr_input ? huisnr_input : ""}
                            onKeyUp={e => {
                              if (e.key === "Enter") {
                                this.handleClick(e);
                              }
                            }}
                            onChange={e => {
                              const input = e.target.value;
                              const huisnr_regex = input.match(/\d+/);
                              const huisletter_regex = input.match(/[A-Za-z]/);
                              // console.log("huisnr", huisnr_regex);
                              // console.log("huisletter", huisletter_regex);

                              let huisnr = null;
                              let huisletter = null;

                              if (huisnr_regex) {
                                huisnr = parseInt(huisnr_regex[0]);
                              }

                              if (huisletter_regex) {
                                huisletter = huisletter_regex[0].toUpperCase();
                              }

                              this.setState({
                                huisnr_input: input.toUpperCase(),
                                huisnr,
                                huisletter
                              });
                            }}
                          />
                        </Td>
                        <Td>Toev.</Td>
                        <Td>
                          <Input
                            type="text"
                            value={toevoeging ? toevoeging : ""}
                            onKeyUp={e => {
                              if (e.key === "Enter") {
                                this.handleClick(e);
                              }
                            }}
                            onChange={e => {
                              this.setState({
                                toevoeging: e.target.value
                              });
                            }}
                          />
                        </Td>
                      </Tr>
                    </tbody>
                  </Table>
                  {loading ? (
                    <StartButton
                      postcode={""}
                      huisnr={""}
                      disabled={true}
                      onClick={this.handleClick}
                    >
                      <ActivityIndicator color={"#fff"} />
                    </StartButton>
                  ) : (
                    <StartButton
                      postcode={postcode ? postcode : ""}
                      huisnr={huisnr ? huisnr.toString() : ""}
                      disabled={!postcode || !huisnr}
                      onClick={this.handleClick}
                    >
                      Start
                    </StartButton>
                  )}
                  {errorMessage ? (
                    <ErrorMessage>{errorMessage}</ErrorMessage>
                  ) : null}
                </SearchInput>
              </SearchBox>
            </SearchWrapper>

            <div
              style={{
                position: "absolute",
                bottom: 142,
                left: 38,
                fontSize: "0.8em"
              }}
            >
              Ontwikkeld door:
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 142,
                left: 'calc(50% - 50px)',
                fontSize: "0.8em"
              }}
            >
              Partners:
            </div>            
            <div
              style={{
                position: "absolute",
                bottom: 142,
                right: 25,
                fontSize: "0.8em"
              }}
            >
              Mogelijk gemaakt door:
            </div>
            <LogosBar>
              <img alt="Nelen & Schuurmans" src={nensLogo} />
              <img alt="Universiteit Utrecht" src={uuLogo} />
              <img alt="Urban Europe" src={urbanEuropeLogo} />
            </LogosBar>
          </Left>
          <Right id="right" />
        </Row>
      </div>
    );
  }
}

export default withRouter(Search);
