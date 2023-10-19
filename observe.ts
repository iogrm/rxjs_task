import { interval, merge, of } from "rxjs";
import { map, mapTo, take } from "rxjs/operators";
import { filter, mergeMap } from "rxjs/operators";
import { deepEqual } from "./equal";
import { wss } from "./wss";

type MatchData = {
  matchId: string;
  random: number;
  players: string[];
};

let i = 0;
const fetchLatestMatch = (val: string): Promise<MatchData> =>
  new Promise((resolve) =>
    resolve({ matchId: val, players: [], random: Math.floor(i++ / 2) })
  );

let game_user: { [n: string]: number[] } = {
  "541234": [1, 2],
  "452345": [2, 3],
  "231443": [3],
};
let games: string[] = ["541234", "452345", "231443"];

let previousDatas: { [n: string]: MatchData } = {
  "541234": { matchId: "541234", players: [], random: 0 },
};
export const execute: () => void = () => {
  const dataObservable = of(games[1]).pipe(
    mergeMap(
      (val) => fetchLatestMatch(val),
      (valueFromSource, valueFromPromise) => {
        if (!previousDatas[valueFromSource]) {
          previousDatas = {
            ...previousDatas,
            [valueFromPromise.matchId]: valueFromPromise,
          };
          return valueFromPromise;
        }

        if (
          valueFromPromise &&
          !deepEqual(previousDatas[valueFromSource], valueFromPromise)
        ) {
          previousDatas = {
            ...previousDatas,
            [valueFromPromise.matchId]: valueFromPromise,
          };
          return valueFromPromise;
        }
      }
    )
  );

  interval(1000).subscribe((val) => {
    dataObservable.subscribe((matchData) => {
      console.log(val, "matchData: ", matchData);
      matchData
        ? wss.clients.forEach((client) =>
            client.send(JSON.stringify(matchData))
          )
        : undefined;
    });
  });
};
