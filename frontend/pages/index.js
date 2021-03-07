import { Container, Grid, Typography } from "@material-ui/core";
import redirect from "nextjs-redirect";
import React from "react";
import Layout from "../src/Layout";
import { login } from "../src/services/api";

const Redirect = redirect("http://192.168.0.2:5000");

export default function Party() {
  const handleClick = () => {
    login();
  };

  return (
    <Layout>
      <Container>
        <Grid container justify="center">
          <Redirect>
            <Typography variant="h4" align="center">
              Redirecting to login...
            </Typography>
          </Redirect>
        </Grid>
      </Container>
    </Layout>
  );
}
