/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useEffect, useState } from "react";
import Select from "../ui/select";
import Button from "../ui/button"; // Add this import
import {
  getBatters,
  getBowlers,
  getCommentary,
  getMatch,
  sendBallData,
} from "../../services/cricService";
import { addBallToOver, Colors, fixFloat, getTotalExtras } from "../../lib/utils";
import {
  CricketContextType,
  IBallCommentary,
  IBatsmanStats,
  IBowlerStats,
  IExtras,
  ITeamStats,
} from "./interfaces";
import Scorecard from "./scoreCard";
export const EXTRAS = {
  WIDES: "wides",
  NO_BALLS: "noBalls",
  BYES: "byes",
  LEG_BYES: "legByes",
  OVER_THROW: "overThrow",
} as const;

export type ExtraType = (typeof EXTRAS)[keyof typeof EXTRAS];

export const DEFAULT_EXTRAS: Record<ExtraType, number> = {
  [EXTRAS.WIDES]: 0,
  [EXTRAS.NO_BALLS]: 0,
  [EXTRAS.BYES]: 0,
  [EXTRAS.LEG_BYES]: 0,
  [EXTRAS.OVER_THROW]: 0,
};
// Update the context creation
export const CricketContext = createContext<CricketContextType>(null);

const ButtonNames = {
  BALL_START: "Ball Start",
  WIDE: "Wide",
  NO_BALL: "No Ball",
  WICKET: "Wicket",
  DONE: "Done",
  MISFIELD: "Misfield",
  OVERTHROW: "Overthrow",
  WICKET_CONFIRM: "Wicket Confirm",
  LEG_BYE: "Leg Bye",
  BYE: "Bye",
  THIRD_UMPIRE: "Third Umpire",
  REVIEW: "Review",
  OTHERS: "Others",
  BOUNDARY_CHECK: "Boundary Check",
  CATCH_DROP: "Catch Drop",
  APPEAL: "Appeal",
  BOWLER_STOP: "Bowler Stop",
  BALL_IN_AIR: "Ball In Air",
  // Add runs as string keys
  RUN_0: "0",
  RUN_1: "1",
  RUN_2: "2",
  RUN_3: "3",
  RUN_4: "4",
  RUN_6: "6",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultCurrentBallInfo: any = {
  over: 0,
  ball: 0,
  run: 0,
  extras: { ...DEFAULT_EXTRAS },
  wicket: false,
  strikerBatsman: null,
  nonStrikerBatsman: null,
  bowler: null,
};

export default function Commentary() {
  const [matchId, setMatchId] = useState("60b8f2d87e4a8a12345678b5");
  const [loading, setLoading] = useState(true);
  const [totalOvers, setTotalOvers] = useState(20);

  const [strikerBatsman, setStrikerBatsman] = useState("1");
  const [nonStrikerBatsman, setNonStrikerBatsman] = useState("2");
  const [selectedBowler, setSelectedBowler] = useState("1");
  const [currentBall, setCurrentBall] = useState(defaultCurrentBallInfo);
  const [batsman, setBatsman] = useState<any>([]);
  const [bowlers, setBowlers] = useState<any>([]);
  const [currentInning, setCurrentInning] = useState(1);

  const getBatmanInfo = (id: string) => {
    return batsman.find((x: { value: string }) => x.value == id);
  };
  const getBowlerInfo = (id: string) => {
    return bowlers.find((x: { value: string }) => x.value == id);
  };

  const [batsmanStats, setBatsmanStats] = useState<{ [key: string]: IBatsmanStats }>({
    [strikerBatsman]: {
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      wickets: 0,
      name: batsman.find((x: { value: string }) => x.value === strikerBatsman)?.name,
    },
    [nonStrikerBatsman]: {
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      wickets: 0,
      name: batsman.find((x: { value: string }) => x.value === nonStrikerBatsman)?.name,
    },
  });
  const [bowlerStats, setBowlerStats] = useState<{ [key: string]: IBowlerStats }>({
    [selectedBowler]: {
      overs: 0,
      runs: 0,
      maidens: 0,
      wickets: 0,
      name: bowlers.find((x: { value: string }) => x.value === selectedBowler)?.name,
      fours: 0,
      sixes: 0,
    },
  });
  const [teamStats, setTeamStats] = useState<ITeamStats>({
    _id: "",
    runs: 0,
    wickets: 0,
    overs: 0,
    extras: DEFAULT_EXTRAS,
  });

  const [matchStats, setMatchStats] = useState({
    nonPlayingTeam: { value: "", ...DEFAULT_EXTRAS },
    result: null,
  });
  const [teams, setTeams] = useState([]);
  const [lastWicket, setLastWicket] = useState<any>(null);
  const [clickedButtons, setClickedButtons] = useState<{ [key: string]: boolean }>({});
  const [isOpen, setIsOpen] = useState(true);

  const [ballHistory, setBallHistory] = useState<string[]>([]);
  const [ballCommentary, setBallCommentary] = useState<IBallCommentary[]>([]);

  const handleButtonClick = (buttonName: string) => {
    setClickedButtons((prev) => ({ ...prev, [buttonName]: !prev[buttonName] }));
    switch (buttonName) {
      case ButtonNames.WICKET:
        handleWicket();
        break;
      case ButtonNames.BALL_START:
        handleNewBall();
        break;
      case ButtonNames.DONE:
        processCurrentBall();
        break;
      // Add more cases as needed
    }
  };

  const changeBowler = (bowlerId: string) => {
    setBowlerStats({
      [bowlerId]: {
        overs: 0,
        runs: 0,
        maidens: 0,
        wickets: 0,
        name: bowlers.find((x: { value: string }) => x.value === bowlerId)?.name,
        fours: 0,
        sixes: 0,
      },
    });
    setSelectedBowler(bowlerId);
  };

  const handleWicket = () => {
    setTeamStats((prev) => ({ ...prev, wickets: prev.wickets + 1 }));
    setLastWicket({
      ...batsmanStats[strikerBatsman],
    });
    // Considering Wicket fallen is going to in bowler's kitty (Normal case not a run out)
    setBowlerStats((prev) => ({
      ...prev,
      [selectedBowler]: {
        ...prev[selectedBowler],
        wickets: prev[selectedBowler].wickets + 1,
      },
    }));
    setStrikerBatsman("");
  };

  const handleNewBall = () => {
    setCurrentBall((prev: { ball: number }) => ({
      ...prev,
      ball: prev.ball == 6 ? 1 : prev.ball + 1,
      runs: 0,
      extras: { ...DEFAULT_EXTRAS },
      wicket: false,
      strikerBatsman: getBatmanInfo(strikerBatsman),
      nonStrikerBatsman: getBatmanInfo(nonStrikerBatsman),
      bowler: getBowlerInfo(selectedBowler),
    }));
  };

  const processCurrentBall = () => {
    if (clickedButtons[ButtonNames.BALL_START]) {
      const isNoBall = clickedButtons[ButtonNames.NO_BALL];
      const isWide = clickedButtons[ButtonNames.WIDE];
      const isWicket = clickedButtons[ButtonNames.WICKET];
      const isLegBye = clickedButtons[ButtonNames.LEG_BYE];
      const isOverThrow = clickedButtons[ButtonNames.OVERTHROW];
      const isBye = clickedButtons[ButtonNames.BYE];
      const isRun_0 = clickedButtons[ButtonNames.RUN_0];
      const isRun_1 = clickedButtons[ButtonNames.RUN_1];
      const isRun_2 = clickedButtons[ButtonNames.RUN_2];
      const isRun_3 = clickedButtons[ButtonNames.RUN_3];
      const isRun_4 = clickedButtons[ButtonNames.RUN_4];
      const isRun_6 = clickedButtons[ButtonNames.RUN_6];

      const extrasRuns: any = { ...DEFAULT_EXTRAS };
      let runsToAdd = 0;
      let ballsToAdd = 1;
      let isLegalDelivery = true;
      let batsmanRuns = 0;

      // Calculate runs based on clicked buttons
      if (isRun_0) runsToAdd = 0;
      if (isRun_1) runsToAdd = 1;
      if (isRun_2) runsToAdd = 2;
      if (isRun_3) runsToAdd = 3;
      if (isRun_4) runsToAdd = 4;
      if (isRun_6) runsToAdd = 6;

      batsmanRuns = runsToAdd;
      // Handle extras
      if (isWide || isNoBall) {
        if (isWide) {
          extrasRuns[EXTRAS.WIDES] = 1;
        }
        if (isNoBall) {
          extrasRuns[EXTRAS.NO_BALLS] = 1;
        }
        runsToAdd += 1;
        ballsToAdd = 0;
        isLegalDelivery = false;
      }

      if (isLegBye || isBye) {
        if (isLegBye) {
          extrasRuns[EXTRAS.LEG_BYES] = runsToAdd;
        }
        if (isBye) {
          extrasRuns[EXTRAS.BYES] = runsToAdd;
        }
        // These runs don't count towards the batsman's score, but do count for the team and bowler
        batsmanRuns = 0;
      }

      if (isOverThrow) {
        extrasRuns[EXTRAS.OVER_THROW] = runsToAdd;
      }
      // Create commentary string
      let commentaryText = `${
        bowlers.find((b: { value: string }) => b.value === selectedBowler)?.name
      } to ${batsman.find((b: { value: string }) => b.value === strikerBatsman)?.name}: `;

      if (isWide) commentaryText += `Wide, ${runsToAdd} run${runsToAdd !== 1 ? "s" : ""}.`;
      else if (isNoBall)
        commentaryText += `No ball, ${runsToAdd} run${runsToAdd !== 1 ? "s" : ""}.`;
      else if (isLegBye)
        commentaryText += `Leg bye, ${runsToAdd} run${runsToAdd !== 1 ? "s" : ""}.`;
      else if (isOverThrow)
        commentaryText += `Overthrow, ${runsToAdd} run${runsToAdd !== 1 ? "s" : ""}.`;
      else if (isBye) commentaryText += `Bye, ${runsToAdd} run${runsToAdd !== 1 ? "s" : ""}.`;
      else if (isWicket) commentaryText += `WICKET! ${strikerBatsman} is out!`;
      else commentaryText += `${runsToAdd} run${runsToAdd !== 1 ? "s" : ""}.`;

      // Add new commentary
      setBallCommentary((prevCommentary) => [
        {
          _id: (prevCommentary.length + 1).toString(),
          over: Math.floor(teamStats.overs),
          ball: ((teamStats.overs * 10) % 10) + 1,
          commentary: commentaryText,
          runs: runsToAdd,
        },
        ...prevCommentary,
      ]);

      //   batsmanStats
      const battersStatsUpdated = [
        {
          player: strikerBatsman,
          runs: (batsmanStats[strikerBatsman]?.runs || 0) + batsmanRuns,
          balls: (batsmanStats[strikerBatsman]?.balls || 0) + ballsToAdd,
          fours:
            batsmanRuns === 4
              ? (batsmanStats[strikerBatsman]?.fours || 0) + 1
              : batsmanStats[strikerBatsman]?.fours || 0,
          sixes:
            batsmanRuns === 6
              ? (batsmanStats[strikerBatsman]?.sixes || 0) + 1
              : batsmanStats[strikerBatsman]?.sixes || 0,
        },
        {
          player: nonStrikerBatsman,
          runs: batsmanStats[nonStrikerBatsman]?.runs,
          balls: batsmanStats[nonStrikerBatsman]?.balls,
          fours: batsmanStats[nonStrikerBatsman]?.fours,
          sixes: batsmanStats[nonStrikerBatsman]?.sixes,
        },
      ];

      // Update batsman stats
      setBatsmanStats((prev) => ({
        ...prev,
        [strikerBatsman]: {
          ...prev[strikerBatsman],
          runs: (prev[strikerBatsman]?.runs || 0) + batsmanRuns,
          balls: (prev[strikerBatsman]?.balls || 0) + ballsToAdd,
          fours:
            batsmanRuns === 4
              ? (prev[strikerBatsman]?.fours || 0) + 1
              : prev[strikerBatsman]?.fours || 0,
          sixes:
            batsmanRuns === 6
              ? (prev[strikerBatsman]?.sixes || 0) + 1
              : prev[strikerBatsman]?.sixes || 0,
        },
      }));
      const bowlerStatsUpdated = {
        player: selectedBowler,
        runs: bowlerStats[selectedBowler].runs + runsToAdd,
        overs: isLegalDelivery
          ? bowlerStats[selectedBowler].overs + 0.1
          : bowlerStats[selectedBowler].overs,
        fours:
          batsmanRuns === 4
            ? (bowlerStats[selectedBowler]?.fours || 0) + 1
            : bowlerStats[selectedBowler]?.fours || 0,
        sixes:
          batsmanRuns === 6
            ? (bowlerStats[selectedBowler]?.sixes || 0) + 1
            : bowlerStats[selectedBowler]?.sixes || 0,
      };

      // Update bowler stats
      setBowlerStats((prev) => ({
        ...prev,
        [selectedBowler]: {
          ...prev[selectedBowler],
          runs: prev[selectedBowler].runs + runsToAdd,
          overs: addBallToOver(prev[selectedBowler].overs, isLegalDelivery),
          wickets: isWicket ? prev[selectedBowler].wickets + 1 : prev[selectedBowler].wickets,
        },
      }));

      const extras = teamStats.extras;
      const extrasUpdated = {
        wides: isWide ? extras?.wides + 1 : extras?.wides || 0,
        noBalls: isNoBall ? extras?.noBalls + 1 : extras?.noBalls || 0,
        byes: isBye ? extras?.byes + runsToAdd : extras?.byes || 0,
        legByes: isLegBye ? extras?.legByes + runsToAdd : extras?.legByes || 0,
        overThrow: isOverThrow ? (extras?.overThrow || 0) + runsToAdd : extras?.overThrow || 0,
      };
      const teamUpdatedStats = {
        ...teamStats,
        runs: teamStats.runs + runsToAdd,
        wickets: isWicket ? teamStats.wickets + 1 : teamStats.wickets,
        overs: addBallToOver(teamStats.overs, isLegalDelivery),
        extras: extrasUpdated,
      };

      // Update team stats
      setTeamStats(teamUpdatedStats);

      const ballInfo = {
        ...currentBall,
        runs: runsToAdd,
        extras,
        wickets: isWicket ? lastWicket : null,
      };
      setCurrentBall(ballInfo);
      // Handle striker change for odd runs or end of over
      if (runsToAdd % 2 !== 0 || Math.floor(teamStats.overs + 0.1) > Math.floor(teamStats.overs)) {
        const temp = strikerBatsman;
        setStrikerBatsman(nonStrikerBatsman);
        setNonStrikerBatsman(temp);
        [battersStatsUpdated[0], battersStatsUpdated[1]] = [
          battersStatsUpdated[1],
          battersStatsUpdated[0],
        ];
      }

      setClickedButtons({});
      let ballNotation = "";
      if (isWide) ballNotation = `${runsToAdd}wd`;
      else if (isNoBall) ballNotation = `${runsToAdd}nb`;
      else if (isLegBye) ballNotation = `${runsToAdd}lb`;
      else if (isBye) ballNotation = `${runsToAdd}b`;
      else if (isWicket) ballNotation = "W";
      else ballNotation = runsToAdd.toString();
      const recentBalls = [ballNotation, ...ballHistory].slice(0, 10);
      setBallHistory(recentBalls);
      let inning = currentInning;
      if (teamUpdatedStats.overs == totalOvers) {
        inning += 2;
        setCurrentInning(2);
      }
      //   Send Data to API
      sendBallData({
        ...ballInfo,
        matchId,
        commentary: commentaryText,
        batsman: ballInfo.strikerBatsman.value,
        nonStriker: ballInfo.nonStrikerBatsman.value,
        bowler: ballInfo.bowler.value,
        teamExtras: extras,
        teamUpdatedStats,
        currentBatsmen: battersStatsUpdated,
        currentBowler: bowlerStatsUpdated,
        currentInnings: inning,
        recentBalls,
      });
    }
  };

  useEffect(() => {
    const fetchMatch = async () => {
      const match = await getMatch();
      console.log("match", match);
      const matchCommentary = await getCommentary();
      setBallCommentary(matchCommentary.data);
      const { teams } = match.data;
      if (teams.length == 0) {
        return;
      }
      let [teamA, teamB] = teams;
      setTeams(teams);
      const currentScore = match.data.currentScore;
      const currentBatsmen = match.data.currentBatsmen;
      const currentBowler = match.data.currentBowler;
      const [striker, nStriker] = currentBatsmen;
      setStrikerBatsman(striker.player);
      setNonStrikerBatsman(nStriker.player);
      setSelectedBowler(match.data.currentBowler.player);
      setCurrentInning(match.data.currentInnings);
      if (match.data.currentInnings == 2) {
        [teamB, teamA] = [teamA, teamB];
      }
      const emptyOptions = { _id: null, value: "Select" };
      setBatsman([
        emptyOptions,
        ...teamA.players.map((x: any) => ({
          ...x,
          value: x._id,
        })),
      ]);
      setBowlers([
        emptyOptions,
        ...teamB.players.map((x: any) => ({
          ...x,
          value: x._id,
        })),
      ]);

      setTeamStats({
        _id: teamA._id,
        value: teamA.shortName,
        wickets: currentScore.wickets,
        overs: currentScore.overs,
        runs: currentScore.runs,
        extras: match?.data?.extras || {
          ...DEFAULT_EXTRAS,
        },
      });
      setBatsmanStats({
        [striker.player]: {
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          wickets: 0,
          name: teamA.players.find((x) => x._id == striker.player)?.name,
          ...striker,
        },
        [nStriker.player]: {
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          wickets: 0,
          name: teamA.players.find((x) => x._id == nStriker.player)?.name,
          ...nStriker,
        },
      });
      setBowlerStats({
        [currentBowler.player]: {
          overs: 0,
          runs: 0,
          maidens: 0,
          wickets: 0,
          ...currentBowler,
          name: teamB.players.find((x) => x._id == currentBowler.player)?.name,
        },
      });
      setMatchStats({
        // playingTeam: { value: teams[0].shortName, runs: 0, wickets: 0, overs: 0, extras: 0 },
        nonPlayingTeam: { value: teamB?.shortName, runs: 0, wickets: 0, overs: 0, extras: 0 },
        result: null,
      });
      setBallHistory(match.data.recentBalls);
      setLoading(false);
    };
    fetchMatch();
  }, []);

  loading && <>Loading....</>;
  return (
    <CricketContext.Provider
      value={{
        teamStats,
        bowlerStats,
        batsmanStats,
        strikerBatsman,
        nonStrikerBatsman,
        selectedBowler,
        matchStats,
        ballHistory,
        ballCommentary,
        currentInning,
        teams,
      }}
    >
      <div className="commentary">
        <div className="row mr-0 mt-2 mb-2">
          <div className="col-10">
            <div className="d-flex align-items-center">
              <span className="grey py-1 px-1 bg-light">Settings</span>
              <button className="btn btn-primary">Match Commentary</button>
            </div>
          </div>
        </div>
        <div className="row mr-0">
          <div className="col-12 col-lg-8 pb-5 card">
            <div className="row">
              <div className="col-4">
                <Select
                  id="batsman-striker"
                  label="Batsman (Striker)"
                  options={batsman}
                  selected={strikerBatsman}
                  onChange={setStrikerBatsman}
                />
              </div>
              <div className="col-4">
                <Select
                  id="batsman-non-striker"
                  label="Batsman (Non-Striker)"
                  options={batsman}
                  selected={nonStrikerBatsman}
                  onChange={setNonStrikerBatsman}
                />
              </div>
              <div className="col-4">
                <Select
                  id="bowler"
                  label="Bowler"
                  options={bowlers}
                  selected={selectedBowler}
                  onChange={changeBowler}
                />
              </div>
            </div>

            <div className="row p-2">
              <div className="col-4 fw-medium">
                Score : {teamStats.runs} / {teamStats.wickets}
              </div>
            </div>
            <div className="row p-2">
              <div className="col-4 fw-medium">Extras : {getTotalExtras(teamStats?.extras)}</div>
            </div>
            <div className="row g-1" style={{ height: "auto", minHeight: "150px" }}>
              <div className="col-6 col-sm-3 fw-medium mb-1">
                <div
                  style={{ display: "flex", flexDirection: "column", gap: "5px", height: "100%" }}
                >
                  <Button
                    className="btn-success flex-grow-1"
                    onClick={() => handleButtonClick(ButtonNames.BALL_START)}
                    clicked={clickedButtons[ButtonNames.BALL_START]}
                  >
                    {ButtonNames.BALL_START}
                  </Button>
                  <Button
                    className="btn-success flex-grow-1"
                    style={{ backgroundColor: Colors.Brown }}
                    onClick={() => handleButtonClick(ButtonNames.WIDE)}
                    clicked={clickedButtons[ButtonNames.WIDE]}
                  >
                    {ButtonNames.WIDE}
                  </Button>
                  <Button
                    className="btn-success flex-grow-1"
                    style={{ backgroundColor: Colors.DarkBlue }}
                    onClick={() => handleButtonClick(ButtonNames.NO_BALL)}
                    clicked={clickedButtons[ButtonNames.NO_BALL]}
                  >
                    {ButtonNames.NO_BALL}
                  </Button>
                </div>
              </div>
              <div className="col-6 col-sm-3 fw-medium mb-1">
                <div
                  style={{ display: "flex", flexDirection: "column", gap: "5px", height: "100%" }}
                >
                  <Button
                    className="btn btn-primary flex-grow-1"
                    onClick={() => handleButtonClick(ButtonNames.RUN_0)}
                    clicked={clickedButtons[ButtonNames.RUN_0]}
                  >
                    {ButtonNames.RUN_0}
                  </Button>
                  <Button
                    className="btn btn-success flex-grow-1"
                    onClick={() => handleButtonClick(ButtonNames.RUN_2)}
                    clicked={clickedButtons[ButtonNames.RUN_2]}
                  >
                    {ButtonNames.RUN_2}
                  </Button>
                </div>
              </div>
              <div className="col-6 col-sm-3 fw-medium mb-1">
                <div
                  style={{ display: "flex", flexDirection: "column", gap: "5px", height: "100%" }}
                >
                  <Button
                    style={{ backgroundColor: Colors.DarkBlue }}
                    className="btn btn-success flex-grow-1"
                    onClick={() => handleButtonClick(ButtonNames.RUN_1)}
                    clicked={clickedButtons[ButtonNames.RUN_1]}
                  >
                    {ButtonNames.RUN_1}
                  </Button>
                  <Button
                    className="btn btn-success flex-grow-1"
                    onClick={() => handleButtonClick(ButtonNames.RUN_6)}
                    clicked={clickedButtons[ButtonNames.RUN_6]}
                  >
                    {ButtonNames.RUN_6}
                  </Button>
                </div>
              </div>
              <div className="col-6 col-sm-3 fw-medium mb-1">
                <div
                  style={{ display: "flex", flexDirection: "column", gap: "5px", height: "100%" }}
                >
                  <Button
                    className="btn btn-success flex-grow-1"
                    style={{ backgroundColor: Colors.Red }}
                    onClick={() => handleButtonClick(ButtonNames.WICKET)}
                    clicked={clickedButtons[ButtonNames.WICKET]}
                  >
                    {ButtonNames.WICKET}
                  </Button>
                  <Button
                    className="btn btn-success flex-grow-1"
                    onClick={() => handleButtonClick(ButtonNames.RUN_4)}
                    clicked={clickedButtons[ButtonNames.RUN_4]}
                  >
                    {ButtonNames.RUN_4}
                  </Button>
                </div>
              </div>
            </div>
            <div className="row g-1 pt-1">
              <div className="col-6 col-sm mb-1">
                <Button
                  className="btn btn-danger w-100"
                  style={{ backgroundColor: Colors.Violet }}
                  onClick={() => handleButtonClick(ButtonNames.BOWLER_STOP)}
                  clicked={clickedButtons[ButtonNames.BOWLER_STOP]}
                >
                  {ButtonNames.BOWLER_STOP}
                </Button>
              </div>
              <div className="col-6 col-sm mb-1">
                <Button
                  className="btn btn-warning w-100"
                  //  onClick={() => handleButtonClick(ButtonNames.BOWLER_STOP)}
                  clicked={clickedButtons["1 or 2"]}
                >
                  1 or 2
                </Button>
              </div>
              <div className="col-6 col-sm mb-1">
                <Button
                  className="btn btn-primary w-100"
                  style={{ backgroundColor: Colors.Violet }}
                  //   onClick={() => handleButtonClick(ButtonNames.BOWLER_STOP)}
                  clicked={clickedButtons["2 or 4"]}
                >
                  2 or 4
                </Button>
              </div>
              <div className="col-6 col-sm mb-1">
                <Button
                  className="btn btn-primary w-100"
                  //  onClick={() => handleButtonClick(ButtonNames.BOWLER_STOP)}
                  clicked={clickedButtons["4 or 6"]}
                >
                  4 or 6
                </Button>
              </div>
              <div className="col-6 col-sm mb-1">
                <Button
                  className="btn btn-danger w-100"
                  style={{ backgroundColor: Colors.Violet }}
                  onClick={() => handleButtonClick(ButtonNames.BALL_IN_AIR)}
                  clicked={clickedButtons[ButtonNames.BALL_IN_AIR]}
                >
                  {ButtonNames.BALL_IN_AIR}
                </Button>
              </div>
            </div>
            <div className="row g-1 pt-1">
              <div className="col-6 col-sm mb-1">
                <Button
                  style={{ backgroundColor: Colors.DarkBlue }}
                  className="btn btn-danger w-100"
                  onClick={() => handleButtonClick(ButtonNames.OTHERS)}
                  clicked={clickedButtons[ButtonNames.OTHERS]}
                >
                  {ButtonNames.OTHERS}
                </Button>
              </div>
              <div className="col-6 col-sm mb-1">
                <Button
                  className="btn btn-danger w-100"
                  onClick={() => handleButtonClick(ButtonNames.RUN_3)}
                  clicked={clickedButtons[ButtonNames.RUN_3]}
                  style={{ backgroundColor: Colors.Violet }}
                >
                  {ButtonNames.RUN_3}
                </Button>
              </div>
              <div className="col-6 col-sm mb-1">
                <Button
                  style={{ backgroundColor: Colors.DarkBlue }}
                  className="btn btn-danger w-100"
                  clicked={clickedButtons[ButtonNames.BOUNDARY_CHECK]}
                  onClick={() => handleButtonClick(ButtonNames.BOUNDARY_CHECK)}
                >
                  {ButtonNames.BOUNDARY_CHECK}
                </Button>
              </div>
              <div className="col-6 col-sm mb-1">
                <Button
                  className="btn btn-secondary w-100"
                  clicked={clickedButtons[ButtonNames.APPEAL]}
                  onClick={() => handleButtonClick(ButtonNames.APPEAL)}
                >
                  {ButtonNames.APPEAL}
                </Button>
              </div>
              <div className="col-6 col-sm mb-1">
                <Button
                  style={{ backgroundColor: Colors.DarkBlue }}
                  clicked={clickedButtons[ButtonNames.CATCH_DROP]}
                  className="btn btn-danger w-100"
                >
                  {ButtonNames.CATCH_DROP}
                </Button>
              </div>
            </div>
            <div className="row g-1 pt-1">
              <div className="col-6 col-sm mb-1">
                <Button
                  className="btn btn-info w-100"
                  clicked={clickedButtons[ButtonNames.LEG_BYE]}
                  onClick={() => handleButtonClick(ButtonNames.LEG_BYE)}
                >
                  {ButtonNames.LEG_BYE}
                </Button>
              </div>
              <div className="col-6 col-sm mb-1">
                <Button
                  className="btn btn-success w-100"
                  clicked={clickedButtons[ButtonNames.BYE]}
                  onClick={() => handleButtonClick(ButtonNames.BYE)}
                >
                  {ButtonNames.BYE}
                </Button>
              </div>
              <div className="col-6 col-sm mb-1">
                <Button
                  className="btn btn-info w-100"
                  clicked={clickedButtons[ButtonNames.THIRD_UMPIRE]}
                  onClick={() => handleButtonClick(ButtonNames.THIRD_UMPIRE)}
                >
                  {ButtonNames.THIRD_UMPIRE}
                </Button>
              </div>
              <div className="col-6 col-sm mb-1">
                <Button
                  className="btn btn-danger w-100"
                  style={{ backgroundColor: Colors.Red }}
                  clicked={clickedButtons[ButtonNames.REVIEW]}
                  onClick={() => handleButtonClick(ButtonNames.REVIEW)}
                >
                  {ButtonNames.REVIEW}
                </Button>
              </div>
            </div>
            <div className="row g-1 pt-1">
              <div className="col-6 col-sm mb-1">
                <Button
                  className="btn btn-success w-100"
                  clicked={clickedButtons[ButtonNames.DONE]}
                  onClick={() => handleButtonClick(ButtonNames.DONE)}
                >
                  {ButtonNames.DONE}
                </Button>
              </div>
              <div className="col-6 col-sm mb-1">
                <Button
                  className="btn btn-primary w-100"
                  clicked={clickedButtons[ButtonNames.MISFIELD]}
                  onClick={() => handleButtonClick(ButtonNames.MISFIELD)}
                >
                  {ButtonNames.MISFIELD}
                </Button>
              </div>
              <div className="col-6 col-sm mb-1">
                <Button
                  className="btn btn-info w-100"
                  clicked={clickedButtons[ButtonNames.OVERTHROW]}
                  onClick={() => handleButtonClick(ButtonNames.OVERTHROW)}
                >
                  {ButtonNames.OVERTHROW}
                </Button>
              </div>
              <div className="col-6 col-sm mb-1">
                <Button
                  className="btn btn-danger w-100"
                  style={{ backgroundColor: Colors.Red }}
                  clicked={clickedButtons[ButtonNames.WICKET_CONFIRM]}
                  onClick={() => handleButtonClick(ButtonNames.WICKET_CONFIRM)}
                >
                  {ButtonNames.WICKET_CONFIRM}
                </Button>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4 pb-5">
            <div className="accordion" id="scoreAccordion">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                  <button
                    className={`accordion-button grey ${isOpen ? "" : "collapsed"}`}
                    type="button"
                    onClick={() => {}}
                    aria-expanded={isOpen}
                    aria-controls="collapseOne"
                  >
                    Score
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className={`accordion-collapse ${isOpen ? "show" : ""}`}
                  aria-labelledby="headingOne"
                >
                  <div className="accordion-body p-0">{isOpen && <Scorecard />}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CricketContext.Provider>
  );
}
