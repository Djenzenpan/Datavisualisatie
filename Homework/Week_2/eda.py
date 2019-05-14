#!/usr/bin/env python
# Name: Jesse Pannekeet
# Student number: 10151494
from functions import *
"""
opens csv file, filters into panda dataframe according to 'filter', finds
some describing values and plots some of the data in the dataframe associated
with gdp and mortality
saves dataframe as json file in path specified by loc
"""
gdp = "GDP ($ per capita) dollars"
mortality = "Infant mortality (per 1000 births)"
filter = ["Country", "Region", "Pop. Density (per sq. mi.)",
          "Infant mortality (per 1000 births)", "GDP ($ per capita) dollars"]
loc = r"D:\Psychobiologie\Mprog\Datavisualisatie\Homework\week2\output.json"

if __name__ == "__main__":
    # Reading and preprocessing data
    table = process_table(pandas.read_csv("input.csv", decimal=','), filter)

    # Prints some of the common measures of GDP
    common_measures(table, gdp)

    # Histogram of GDP
    plot_hist(table, gdp)

    # Prints five number summary of mortality rate
    five_numbers(table, mortality)

    # Boxplot of mortality rate
    plot_boxp(table, mortality)

    # Converts panda dataframe to JSON file with country name as index
    conv_to_json(table, "Country", loc)
