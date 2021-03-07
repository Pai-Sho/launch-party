import { Typography, withStyles } from "@material-ui/core";
import Link from "next/link";

const styles = {
  link: {
    color: "white",
    cursor: "pointer",
    transition: "color 1s",
    "&:hover": {
      color: "green",
    },
  },
};

const LinkTypography = ({ href, classes, children, typographyProps }) => {
  return (
    <Link href={href}>
      <Typography {...typographyProps} className={classes.link}>
        {children}
      </Typography>
    </Link>
  );
};

export default withStyles(styles)(LinkTypography);
