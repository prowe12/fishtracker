#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Mar  4 15:00:47 2025

@author: prowe
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# I examined the data and determined that:
#
# - Different release and collection dates
# - Measurements are made approximately every 3 seconds
# - Short time periods with day+ gaps between them
# - Most of the MSEs are within 0.25 (rms 0.5), with a few very large values
# - Either fish can move fast (80 X-units/3 s!) or some MSEs are too small
#   This suggests the reservoir is very small?

# Convenient groupings:
# 1) By fish tag
# 2) By time window

# Filters needed:
# 1) Filter out high MSEs
# 2)

# Questions:
# 1) Given that x and y are in feet and depth is in m, presumably MSE
#    corresponds only to x and y and is the same for each? How is it
#    calculated?
# 2) What is the x,y,z coordinate of the collection?


direc = "/Users/prowe/Sync/other/jobs/org/four_peaks/project/"
fname = "fishPos_20190604.csv"

# Fish position estimates for study fish migrating through the
# hypothetical reservoir between May 23, 2019, and June 4, 2019
fish_pos = pd.read_csv(direc + fname)
fish_pos["Date_time"] = pd.to_datetime(fish_pos["Date_time"])  # SLOW!
fish_pos["rms"] = np.sqrt(fish_pos["MSE"])

plt.figure(num=1, clear=True)
fish_pos.hist()

# Check out the data
print(fish_pos["Date_time"].describe())
print(fish_pos["MSE"].describe())
print(fish_pos["X"].describe())
print(fish_pos["Y"].describe())


fish = fish_pos[fish_pos["MSE"] < 10].copy()
tags = fish["Tag_code"].unique()

# Plot all the trajectories
plt.figure(num=2, clear=True)
for tag in tags:
    fish0 = fish[fish["Tag_code"] == tag]
    plt.scatter(fish0["X"], fish0["Y"], alpha=0.1, s=0.1)
    plt.pause(0.1)


# Look at the first few fish
fish0 = fish[fish_pos["Tag_code"] == tags[0]]
fish1 = fish[fish_pos["Tag_code"] == tags[1]]
fish2 = fish[fish_pos["Tag_code"] == tags[2]]


# Plot all the starting points
plt.figure(num=2, clear=True)
for tag in tags:
    fish0 = fish[fish["Tag_code"] == tag]
    plt.plot(fish0["Date_time"].iloc[0], fish0["X"].iloc[0], ".")

# Plot all the ending points
plt.figure(num=2, clear=True)
for tag in tags:
    fish0 = fish[fish["Tag_code"] == tag]
    plt.plot(fish0["Date_time"].iloc[-1], fish0["X"].iloc[-1], ".")


# Look at some of the time series
# fig, axes = plt.subplots(num=1, clear=True, nrows=2, ncols=2)
plt.figure(num=2, clear=True)
plt.errorbar(fish0["Date_time"], fish0["X"], fish0["rms"], fmt=".")
plt.figure(num=3, clear=True)
plt.errorbar(fish1["Date_time"], fish1["X"], fish1["rms"], fmt=".")
plt.figure(num=4, clear=True)
plt.errorbar(fish2["Date_time"], fish2["X"], fish2["rms"], fmt=".")


# Check out the MSE
plt.figure(num=1, clear=True)
plt.subplot(211)
plt.hist(fish_pos["MSE"])
plt.subplot(212)
plt.hist(fish_pos["MSE"][fish_pos["MSE"] <= 100])

# Remove high MSE points
fish = fish_pos[fish_pos["MSE"] < 10]
plt.figure(num=1, clear=True)
plt.hist(fish["MSE"])

#

# for i,tag in enumerate(tags):
#     fish0 = fish_pos[fish_pos["Tag_code"] == tag]
#     plt.figure(num=i, clear=True)
#     plt.scatter(fish0["X"], fish0["Y"])

plt.figure(num=2, clear=True)
plt.scatter(fish1["X"], fish1["Y"])

plt.figure(num=3, clear=True)
plt.scatter(fish2["X"], fish2["Y"])


# Get the first few fishes
plt.figure(num=1, clear=True)
for tag in tags:
    fish = fish_pos[fish_pos["Tag_code"] == tag]
    if fish["MSE"].iloc[0] < 100:
        #     print(fish["X"].iloc[0])
        plt.plot(fish["X"].iloc[0], fish["Y"].iloc[0], "b.")
    else:
        plt.plot(fish["X"].iloc[0], fish["Y"].iloc[0], "rx")
plt.xlim([-100, 100])
plt.ylim([-100, 100])


fish0 = fish

plt.figure(num=2, clear=True)
tlen = round(len(fish0) / 8)
i1 = 0
i2 = tlen
n = len(fish0)
while i1 < n - 2:
    if i2 > n:
        i2 = n - 1
    inds = np.arange(i1, i2)
    ikeep = inds
    # ikeep = inds[np.where(fish0['MSE'].to_numpy()[inds]<.25)[0]]
    plt.plot(fish0["X"].to_numpy()[ikeep], fish0["Y"].to_numpy()[ikeep], ".-")
    i1 = i2
    i2 = i1 + tlen

plt.figure(num=3, clear=True)
plt.xlim([-65, 105])
plt.ylim([-30, 130])
for i in range(len(fish0)):
    plt.plot(fish0["X"].iloc[i], fish0["Y"].iloc[i], ".-")
    plt.pause(1)

plt.scatter(fish0["X"], fish0["Y"])


# # Resample to x minutes
# series.resample("3min").sum()


# For speed, only the first ilen rows
ilen = 100000
pos = fish_pos[:ilen]
pos["Date_time"] = pd.to_datetime(pos["Date_time"])


levels, categories = pd.factorize(
    pos["Tag_code"]
)  # create the array of category integers

plt.figure(num=1, clear=True)
scatter = plt.scatter(
    pos["X"], pos["Y"], c=levels, s=5
)  # this returns a `PathCollection` object
plt.legend(scatter.legend_elements()[0], categories, title="Tag")
plt.gca().set(xlabel="X", ylabel="Y", title="Fish Location")

pos.plot()


# Check out the data
print(f"Number of unique tags: {len(pos['Tag_code'].unique())}")


plt.figure(num=1, clear=True)
pos.plot(x="Date_time", y="X", marker=".", linestyle="none")


plt.figure()
plt.plot(fish0["Date_time"], pos["MSE"][:ilen], ".")

# What are the units of MSE?
plt.figure()
pos["MSE"].hist()
plt.figure()
pos["MSE"][pos["MSE"] < 0.25].hist()


plt.figure()
pos["MSE"].plot()
