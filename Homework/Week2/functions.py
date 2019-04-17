#!/usr/bin/env python
# Name: Jesse Pannekeet
# Student number: 10151494
import pandas
import csv
import numpy as np
import matplotlib.pyplot as plt
import json


def process_table(data):
    data = data.filter(items=filter)
    data["Pop. Density (per sq. mi.)"].replace("unknown", np.nan, inplace=True)
    data["GDP ($ per capita) dollars"].replace("unknown", np.nan, inplace=True)
    data.dropna(axis=0, how='any', inplace=True)
    data["Region"] = data["Region"].str.strip()
    data["GDP ($ per capita) dollars"] = data["GDP ($ per capita) dollars"].map(lambda x: x.rstrip(" dollars"))
    data["GDP ($ per capita) dollars"] = pandas.to_numeric(data["GDP ($ per capita) dollars"])
    data["Infant mortality (per 1000 births)"] = pandas.to_numeric(data["Infant mortality (per 1000 births)"])
    return(data)


def common_measures(data, string):
    print("Mean, median, mode and standard deviation of GDP ($ per capita) for countries around the world:")
    print("Mean: " + str(round(np.mean(data[string]), 1)))
    print("Median: " + str(np.median(data[string])))
    print("Mode: " + str(data.mode(axis=0)[string][0]))
    print("Standard deviation: " + str(round(np.std(data[string]), 1)))
    print("")


def plot_hist(data, string):
    plt.hist(list(data[string]),bins=200,density=False)
    plt.title("Histogram of countries' GDP ($ per capita) in dollars")
    plt.xlabel("GDP ($ per capita)")
    plt.ylabel("Number of countries")
    plt.show()


def five_numbers(data, string):
    print("Minimum, 1st qaurtile, median, 3rd qaurtile and Maximum of infant mortality (per 1000 births) for countries around the world:")
    print("Minimum: " + str(np.min(data[string])))
    print("First qaurtile: " + str(np.percentile(data[string], 25)))
    print("Median: " + str(np.median(data[string])))
    print("3rd qaurtile: " + str(np.percentile(data[string], 75)))
    print("Maximum: " + str(np.max(data[string])))


def plot_boxp(data, string):
    plt.boxplot(data[string])
    plt.title("Boxplot of countries' infant mortality (per 1000 births)")
    plt.ylabel("Infant mortality (per 1000 births)")
    plt.show()


def conv_to_json(data, index, string):
    data.set_index(index, inplace=True)
    data.to_json(string, orient='index')


def plot_scatter(data, observation_one, observation_two):
    regions = []
    for region in data["Region"]:
        if region not in regions:
            regions.append(region)
    colours = ["k", "b", "r", "y", "g", "gray", "m", "turquoise","saddlebrown", "c", "mediumpurple"]

    for region, colour in zip(regions, colours):
        data = data[data.Region == region]
        plt.scatter(data[observation_one], data[observation_two], label=region,
                    s=2, c=colour, marker="s")
    plt.show()

    ### regression? ###
    print(data[observation_two])
    m,b = np.polyfit(data[observation_one],
                     data[observation_two], 1)
    plt.plot(b*data[observation_two]+m)
    plt.show()
