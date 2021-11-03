import React, { useState, useEffect } from "react"
import Chart from "react-apexcharts"
import Dropdown from "react-bootstrap/Dropdown"
import { FiCheck } from "react-icons/fi"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./graph.css"
import "./PieChart.css"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"

import { Typography, Grid } from "@mui/material"
import arr from "./PieChart_Data"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import { styled } from "@mui/material/styles"
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}))

function PieCharts(props) {
  const [checked, setChecked] = React.useState([0])

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }
  const handleOnChange = () => {}
  const [data, setData] = useState(null)
  const [filters, setFilters] = useState({
    nofilters: {},
    gender: {},
    age: {},
    region: {},
  })
  const legends = {
    position: "bottom",
    horizontalAlign: "left",
    width: 700,
    offsetX: 0,
    offsetY: 5,
    markers: { radius: 0 },
    itemMargin: {
      horizontal: 0,
      vertical: 10,
    },
  }
  const legends1 = {
    show: false,
  }
  const [labels, setLabels] = useState(null)

  const graphOption = {
    options: {
      labels,
      plotOptions: {
        pie: {
          offsetX: 0,
          dataLabels: {
            offset: -10,
          },
        },
      },
    },
  }

  const handleClick = (e) => {
    e.stopPropagation()
    if (e.target.classList.contains("overall")) {
      if (filters.nofilters.overall !== undefined) {
        const obj = {}
        setFilters({ ...filters, nofilters: obj })
      } else {
        settingOverall()
      }
      return
    }
    const id = e.target.id

    const elems = id.split(":")
    const elem = elems[0].split(",")
    const elem1 = elem[0]
    const elem2 = elem[1]

    const arr = Object.values(data.data.payload[elem1][elem2])
    const obj = { ...filters[elem1], [elem2]: arr }
    if (filters[elem1][elem2] !== undefined) {
      const a = { ...filters[elem1] }
      delete a[elem2]
      setFilters({ ...filters, [elem1]: a })
    } else {
      setFilters({ ...filters, [elem1]: obj })
    }
    console.log(filters)
  }

  const handleDelete = (e) => {
    if (e.target.classList.contains("overall")) {
      if (filters.nofilters.overall !== undefined) {
        const obj = {}
        setFilters({ ...filters, nofilters: obj })
      } else {
        settingOverall()
      }
      return
    }
    const val = e.target.className
    for (let key in filters) {
      if (filters[key][val] !== undefined) {
        const obj = { ...filters[key] }
        delete obj[val]
        setFilters({ ...filters, [key]: obj })
      }
    }
  }

  const settingOverall = () => {
    const arr = Object.values(data.data.payload.global)
    const obj = { overall: arr }

    setFilters({ ...filters, nofilters: obj })
  }

  const handleEnter = (e) => {
    e.target.click()
  }

  const notify = () => {
    navigator.clipboard.writeText(window.location.href)
    toast("Copied to clipboard")
  }

  useEffect(() => {
    setData(props.data)
  }, [])

  console.log(props)
  useEffect(() => {
    if (data) {
      setLabels(data.data.payload.poll.options.map((val, idx) => val.name))
      settingOverall()
    }
  }, [data])

  console.log(props.data)
  return (
    <>
      <div className="container">
        <ToastContainer />
        {data ? (
          <h4 className="heading">
            {data.data.payload.poll.question}{" "}
            <span onClick={notify}>
              Share result{" "}
              <i style={{ color: "#84855d" }} className="fas fa-share-alt"></i>
            </span>
          </h4>
        ) : (
          ""
        )}
      </div>
      <div
        style={{
          display: "flex",
          margin: "0",
        }}
      >
        <div className="filter__bar">
          <div
            style={{
              display: "flex",
              margin: "0 10px",
              flexDirection: "column",
            }}
          >
            {" "}
            <Dropdown.Item className="overall" onClick={handleClick}>
              Overall
            </Dropdown.Item>
            <Typography center variant="h6" style={{ color: "#84855D" }}>
              Gender
            </Typography>
            <List sx={{ bgcolor: "background.paper" }}>
              {data
                ? Object.keys(data.data.payload.gender).map((value, key) => {
                    const labelId = `checkbox-list-label-${value}`
                    return (
                      <ListItem disablePadding>
                        <ListItemButton>
                          <div style={{ marginRight: "7%" }}>
                            <input
                              type="checkbox"
                              key={key}
                              id={"gender," + value + ":" + key}
                              className={value}
                              onClick={handleClick}
                            />
                          </div>
                          {value}{" "}
                          <FiCheck id={"check," + value} className={"check"} />
                        </ListItemButton>
                      </ListItem>
                    )
                  })
                : ""}
            </List>
            <Typography center variant="h6" style={{ color: "#84855D" }}>
              Age Groups
            </Typography>
            <List sx={{ bgcolor: "background.paper" }}>
              {data
                ? Object.keys(data.data.payload.age).map((value, key) => (
                    <ListItem disablePadding>
                      <ListItemButton>
                        <div style={{ marginRight: "7%" }}>
                          <input
                            type="checkbox"
                            key={key}
                            id={"age," + value + ":" + key}
                            className={value}
                            onClick={handleClick}
                          />
                        </div>
                        {value}
                        <FiCheck id={"check," + value} className={"check"} />
                      </ListItemButton>
                    </ListItem>
                  ))
                : ""}
            </List>
            <Dropdown className="d-inline mx-2" autoClose="outside">
              <Dropdown.Toggle
                style={{ backgroundColor: "#84855D" }}
                id="dropdown-autoclose-outside"
                onMouseEnter={handleEnter}
              >
                Region
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {data
                  ? Object.keys(data.data.payload.region).map((value, key) => (
                      <Dropdown.Item
                        key={key}
                        id={"region," + value + ":" + key}
                        className={value}
                        onClick={handleClick}
                      >
                        {value}{" "}
                        <FiCheck id={"check," + value} className={"check"} />
                      </Dropdown.Item>
                    ))
                  : ""}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div
          style={{
            width: "70%",
            margin: "0 17% 0 13%",

            overflowY: "scroll",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              {Object.keys(filters).map((value, key1) =>
                Object.keys(filters[value]).length > 0 ? (
                  <>
                    <h4
                      style={{ margin: "0 auto", textTransform: "uppercase" }}
                    >
                      {value !== "nofilters" ? value : ""}
                    </h4>

                    <Grid
                      container
                      spacing={1}
                      style={{
                        margin: "0 auto",
                        textAlign: "center",
                        display: "flex",
                      }}
                    >
                      {Object.keys(filters[value]).map((val, idx) =>
                        labels != null ? (
                          <Grid
                            columns={{ xs: 12, sm: 6, md: 6 }}
                            item
                            rowSpacing={1}
                            style={{
                              textAlign: "center",
                              display: "flex",
                              margin: "0 auto",
                            }}
                          >
                            {idx === Object.keys(filters[value]).length - 1 ? (
                              <Chart
                                key={idx}
                                options={{
                                  ...graphOption.options,
                                  legend: legends1,
                                  title: { text: val, align: "center" },
                                }}
                                series={filters[value][val]}
                                type="pie"
                                width="300px"
                                style={{ margin: "0 auto" }}
                              />
                            ) : (
                              <Chart
                                key={idx}
                                options={{
                                  ...graphOption.options,
                                  legend: legends1,
                                  title: { text: val, align: "center" },
                                }}
                                series={filters[value][val]}
                                type="pie"
                                width="300px"
                              />
                            )}
                          </Grid>
                        ) : (
                          <></>
                        )
                      )}
                    </Grid>
                  </>
                ) : (
                  <></>
                )
              )}
              <></>
            </Grid>
          </Box>
        </div>
        <div className="filter__bar2" style={{}}>
          {arr.map((item, idx) => {
            return (
              <div style={{ display: "flex" }}>
                <span
                  style={{ background: `${item.color}` }}
                  className="color_pie"
                ></span>
                <p className="pie_title">{item.title}</p>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default PieCharts
