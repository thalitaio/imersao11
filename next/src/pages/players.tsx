import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material";
import type { NextPage } from "next";
import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
import { Label } from "../components/Label";
import { Page } from "../components/Page";
import { Section } from "../components/Section";
import { TeamLogo } from "../components/TeamLogo";
import { Player, PlayersMap } from "../util/models";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person2";
import { httpAdmin } from "../util/http";

const players = [
  {
    id: "64fb9c2f-a45b-4f96-9d8b-b127878ca6f3",
    name: "Messi",
    price: 35,
  },
  {
    id: "4876d14f-d998-4abf-96ef-89fd53185464",
    name: "Cristiano Ronaldo",
    price: 35,
  },
  {
    id: "0f463bea-1dbd-4765-b080-9f5f170b6ded",
    name: "Neymar",
    price: 25,
  },
  {
    id: "c707bfa9-074e-4636-8772-633e4b56248d",
    name: "Vinicius Junior",
    price: 25,
  },
  {
    id: '5',
    name: "De Bruyne",
    price: 15,
  },
  {
    id: '6',
    name: "Lewandowski",
    price: 15,
  },
  {
    id: '7',
    name: "Maguirre",
    price: 15,
  },
  {
    id: '8',
    name: "Richarlison",
    price: 15,
  },
  {
    id: '9',
    name: "Harry Kane",
    price: 15,
  },
];

const fakePlayer = {
  id: '',
  name: "Escolha um jogador",
  price: 0,
};

const makeFakePlayer = (key: number) => ({
  ...fakePlayer,
  name: `${fakePlayer.name} ${key + 1}`,
});

const totalPlayers = 4;
const balance = 300;

const fakePlayers: Player[] = new Array(totalPlayers)
  .fill(0)
  .map((_, key) => makeFakePlayer(key));

const ListPlayersPage: NextPage = () => {
  const [playersSelected, setPlayersSelected] = useState(fakePlayers);

  const countPlayersUsed = useMemo(
    () => playersSelected.filter((player) => player.id !== '').length,
    [playersSelected]
  );

  const budgetRemaining = useMemo(
    () =>
      balance - playersSelected.reduce((acc, player) => acc + player.price, 0),
    [playersSelected]
  );

  const addPlayer = useCallback((player: Player) => {
    setPlayersSelected((prev) => {
      const hasFound = prev.find((p) => p.id === player.id);
      if (hasFound) return prev;

      const firstIndexFakerPlayer = prev.findIndex((p) => p.id === '');
      if (firstIndexFakerPlayer === -1) return prev;

      const newPlayers = [...prev];
      newPlayers[firstIndexFakerPlayer] = player;
      return newPlayers;
    });
  }, []);

  const removePlayer = useCallback((index: number) => {
    setPlayersSelected((prev) => {
      const newPlayers = prev.map((p, key) => {
        if (key === index) {
          return makeFakePlayer(key);
        }
        return p;
      });
      return newPlayers;
    });
  }, []);

  const saveMyPlayers = useCallback(async () => {
    await httpAdmin.put(
      "/my-teams/22087246-01bc-46ad-a9d9-a99a6d734167/players",
      {
        players_uuid: playersSelected.map((player) => player.id),
      }
    );
  }, [playersSelected]);

  return (
    <Page>
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: (theme) => theme.spacing(4),
        }}
      >
        <Grid item xs={12}>
          <Section>
            <TeamLogo
              sx={{
                position: "absolute",
                flexDirection: "row",
                ml: (theme) => theme.spacing(-5.5),
                mt: (theme) => theme.spacing(-3.5),
                gap: (theme) => theme.spacing(1),
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: (theme) => theme.spacing(2),
              }}
            >
              <Label>Você ainda tem</Label>
              <Label>C$ {budgetRemaining}</Label>
            </Box>
          </Section>
        </Grid>
        <Grid item xs={12}>
          <Section>
            <Grid container>
              <Grid item xs={6}>
                <Autocomplete
                  sx={{ width: 400 }}
                  isOptionEqualToValue={(option, value) => {
                    console.log(option);
                    return option.name
                      .toLowerCase()
                      .includes(value.name.toLowerCase());
                  }}
                  getOptionLabel={(option) => option.name}
                  options={players}
                  onChange={(_event, newValue) => {
                    if (!newValue) {
                      return;
                    }
                    addPlayer(newValue);
                  }}
                  renderOption={(props, option) => (
                    <React.Fragment key={option.name}>
                      <ListItem {...props}>
                        <ListItemAvatar>
                          <Avatar>
                            <Image
                              src={PlayersMap[option.name]}
                              width={40}
                              height={40}
                              alt=""
                            />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${option.name}`}
                          secondary={`C$ ${option.price}`}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Pesquise um jogador"
                      InputProps={{
                        ...params.InputProps,
                        sx: {
                          backgroundColor: (theme) =>
                            theme.palette.background.default,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Label>Meu time</Label>
                <List>
                  {playersSelected.map((player, key) => (
                    <React.Fragment key={key}>
                      <ListItem
                        secondaryAction={
                          <IconButton
                            edge="end"
                            disabled={player.id === ''}
                            onClick={() => removePlayer(key)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar>
                            {player.id === '' ? (
                              <PersonIcon />
                            ) : (
                              <Image
                                src={PlayersMap[player.name]}
                                width={40}
                                height={40}
                                alt=""
                              />
                            )}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={player.name}
                          secondary={`C$ ${player.price}`}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Section>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            size="large"
            disabled={countPlayersUsed < totalPlayers || budgetRemaining < 0}
            onClick={() => saveMyPlayers()}
          >
            Salvar
          </Button>
        </Grid>
      </Grid>
    </Page>
  );
};

export default ListPlayersPage;
