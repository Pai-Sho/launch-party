import { Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { useCounter, useInterval } from "react-use";
import VibeCell from "./VibeCell";

const VibeColumn = ({ seedKey, cellColor }) => {
  const rows = [1, 2, 3, 4, 5, 6, 7, 8];
  const [current, { inc, dec }] = useCounter(rows.length, rows.length, 0);

  useInterval(() => {
    if (Math.random() > 0.45) {
      dec(1);
    } else {
      inc(1);
    }
  }, 200);

  return (
    <Grid container direction="column">
      {rows.map((x) => (
        <VibeCell
          key={(seedKey + x).toString() + "_row"}
          color={x > current ? cellColor : "#4F5B62"}
        />
      ))}
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: "320px",
  },
}));

export default function Vibemeter({ cellColor, setCellColor }) {
  const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const classes = useStyles();

  return (
    <Grid container justify="center">
      <div className={classes.root}>
        <Grid container item>
          {cols.map((x) => (
            <Grid key={x.toString() + "_griditem"} item>
              <VibeColumn
                key={x.toString() + "_col"}
                seedKey={x + 20}
                cellColor={cellColor}
                setCellColor={setCellColor}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </Grid>
  );
}
