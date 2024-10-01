import { useContext, useState } from "react";
import { CricketContext } from "./Board";
import { IBatsmanStats } from "./interfaces";
import BallCommentary from "./ballCommentory";
import { fixFloat, getTotalExtras } from "../../lib/utils";

const Scorecard = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = useContext(CricketContext);
  const playingTeam = data.teamStats;
  const currentInning = data.currentInning || 1;
  const nonPlayingTeam = data.matchStats.nonPlayingTeam;
  const strikerBatsman = data?.batsmanStats[data.strikerBatsman];
  const nonStrikerBatsman = data?.batsmanStats[data.nonStrikerBatsman];
  const selectedBowler = data.bowlerStats[data.selectedBowler];
  const [selectedTeam, setSelectedTeam] = useState(playingTeam?._id);

  const ballHistory = data.ballHistory || [];

  //   Strike rate = (Runs scored / Balls faced) x 100data.matchStats.teams[0].batsmanStats
  const calculateStrikeRate = (batsmanData: IBatsmanStats): string => {
    if (!batsmanData) {
      return "N/A";
    }
    if (batsmanData?.balls === 0) {
      return "0.00";
    }
    const strikeRate = (batsmanData?.runs / batsmanData?.balls) * 100;
    return strikeRate.toFixed(2);
  };

  return (
    <div className="custom-accordion-body">
      <div className="row mb-4">
        <div className="col text-center">
          <p>{playingTeam.value}*</p>
          <p className="h4 fw-bold">
            {playingTeam.runs}/{playingTeam.wickets}
          </p>
          <p>Over {fixFloat(playingTeam.overs)}</p>
        </div>
        <div className="col text-center text-danger fw-bold">vs</div>
        <div className="col text-center">
          <>
            <p>{nonPlayingTeam.value}</p>
            <p className="h4 fw-bold">
              {currentInning == 2 && nonPlayingTeam.runs + " / " + nonPlayingTeam.wickets}
            </p>
            {currentInning == 1 && <p className="fw-bold">Yet To Bat</p>}
            <p> {currentInning == 2 && "Over " + nonPlayingTeam.overs}</p>
          </>
        </div>
      </div>
      {data.matchStats?.result && (
        <div className="grey text-center mb-2 fw-bold">{data.matchStats?.result}</div>
      )}

      {/* Batsman/Bowler Stats */}
      <table className="table table-sm mb-4 table-borderless">
        <thead>
          <tr>
            <th>Batsman</th>
            <th>R</th>
            <th>B</th>
            <th>4s</th>
            <th>6s</th>
            <th>S/R</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{strikerBatsman?.name}*</td>
            <td>{strikerBatsman?.runs}</td>
            <td>{strikerBatsman?.balls}</td>
            <td>{strikerBatsman?.fours}</td>
            <td>{strikerBatsman?.sixes}</td>
            <td>{calculateStrikeRate(strikerBatsman)}</td>
          </tr>
          <tr>
            <td>{nonStrikerBatsman?.name}</td>
            <td>{nonStrikerBatsman?.runs}</td>
            <td>{nonStrikerBatsman?.balls}</td>
            <td>{nonStrikerBatsman?.fours}</td>
            <td>{nonStrikerBatsman?.sixes}</td>
            <td>{calculateStrikeRate(nonStrikerBatsman)}</td>
          </tr>
        </tbody>
      </table>

      <table className="table table-sm mb-4">
        <thead>
          <tr>
            <th>Bowler</th>
            <th>O</th>
            <th>M</th>
            <th>R</th>
            <th>W</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{selectedBowler?.name}*</td>
            <td>{selectedBowler?.overs}</td>
            <td>{selectedBowler?.maidens}</td>
            <td>{selectedBowler?.runs}</td>
            <td>{selectedBowler?.wickets}</td>
          </tr>
        </tbody>
      </table>
      {/* Extras and Over Details */}
      <div className="mb-2 grey rounded p-1 font-weight-light">
        <div className="btn-group">
          <strong
            style={{
              paddingRight: "20px",
            }}
          >
            Last 10 Balls:
          </strong>
          {ballHistory.map((ball: number, index: number) => (
            <div key={index} className="run-tag">
              {ball}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-2 grey rounded p-1 font-weight-light">
        <div className="btn-group ">
          <strong
            style={{
              paddingRight: "20px",
            }}
          >
            Extras:
          </strong>
          <div>
            {getTotalExtras(playingTeam.extras)}(<strong>b </strong>
            {playingTeam?.extras?.byes}, <strong>lb </strong>
            {playingTeam?.extras?.legByes} <strong>nb </strong>
            {playingTeam?.extras?.noBalls} <strong>wd </strong>
            {playingTeam?.extras?.wides} <strong>p </strong>
            {0})
          </div>
        </div>
      </div>

      <div className="row pb-2">
        <div className="col-8">
          <select
            id="select-team"
            className="form-select"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            {data.teams.map((team: any) => {
              return (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="col-4">
          <select
            id="inning"
            className="form-select"
            value={currentInning}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </div>
      </div>

      {/* Commentary */}
      <div className="mb-4">
        <BallCommentary />
      </div>
    </div>
  );
};
export default Scorecard;
