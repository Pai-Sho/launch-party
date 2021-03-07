import { Typography } from "@material-ui/core";

export default function Copyright() {
  return (
    <Typography
      variant="body2"
      color="textSecondary"
      align="center"
      className={classes.copyright}
    >
      Copyright © Benjamin Bienz {new Date().getFullYear()}
    </Typography>
  );
}
