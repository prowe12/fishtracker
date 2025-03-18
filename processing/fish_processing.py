#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Mar  5 16:33:32 2025

@author: prowe


Develop an interactive data visualization of fish behavior in a waterbody to:

- Enable a fish biologist (user) to investigate behavioral differences 
  between fish that are collected and those that remain at large. 
- Specifically, the user will be interested in visualizing:
   -- where fish have been in the waterbody and 
   -- what proportion of the fish that were released were collected 
- The user is also interested in investigating the differences, if any, 
  between the movement patterns of different species of fish.

Important notes:
 - Only fish collected at the "Final Collection Point" under the Site Name 
   column should be considered as having successfully located the collection 
   point for this study.
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from geopy.distance import distance
from geopy.point import Point


def get_tag_dicts(pit_tags: pd.Series, atags: pd.Series) -> list[dict, dict]:
    """
    Given one-to-one series of tags return dictionaries that map them
    to each other
    """
    inds = ~atags.isna()
    pit_tags = pit_tags[inds]
    atags = atags[inds]

    # Create dictionaries
    p_to_a = pd.Series(atags.values, index=pit_tags).to_dict()
    a_to_p = pd.Series(pit_tags.values, index=atags).to_dict()

    return p_to_a, a_to_p


def create_df_for_saving(dfin: pd.DataFrame, tag0: dict[str]) -> pd.DataFrame:
    """
    Create dataframe for collected fish including datetime, tag, x, y, and
    atag: remove MSE and Tag_code to save space, append fish species,
    convert x and y to lat and lon
    """

    dfout = dfin[["Date_time", "atag", "X", "Y", "Z"]].copy()
    dfout.loc[:, "species"] = dfout["atag"].map(tag0)
    dfout.loc[dfout["species"].isnull(), "species"] = "unknown"

    origin0 = Point(LATITUDE, LONGITUDE)
    lons0 = [
        distance(miles=x * FT_TO_MILE).destination(origin0, 90).longitude
        for x in dfin["X"]
    ]
    lats0 = [
        distance(miles=y * FT_TO_MILE).destination(origin0, 0).latitude
        for y in dfin["Y"]
    ]

    dfout.loc[:, "X"] = lons0
    dfout.loc[:, "Y"] = lats0
    dfout = dfout[["Date_time", "atag", "species", "X", "Y", "Z"]]
    return dfout


def save_file_by_species(df: pd.DataFrame, fname_head: str):
    """Loop over species in a dataframe and create a json file for each"""
    species_array = df["species"].unique()
    for species in species_array:
        fname = f"{fname_head}_{species}.json"
        print(f"Saving file {fname}")
        fish_tosave = df[df["species"] == species]
        fish_tosave.to_json(fname, orient="split", indent=4)


# # # # # # # #   INPUT PARAMETERS   # # # # # # # # # #
# Directories and file names
DIREC = ""
FISHPOS_FILE = "fishPos_20190604.csv"
PIT_FILE = "PIT_CE.xlsx"
FNAME_COLLECTED = "fish_collected.json"
FNAME_ATLARGE = "fish_atlarge.json"
FNAME_SUMMARY = "summary_statistics.json"

# Parameters
COLLECTION_POINT = "Final Collection Point "
LATITUDE = 47.155
LONGITUDE = -122.683
FT_TO_MILE = 4 / 5280  # Fake feet - Multiply by factor b/c its too small
AVERAGING_TIME = "10min"

# Quality control parameters
MSE_THRESHOLD = 10  # Max allowed MSE
MAX_BURST_SPEED = 7  # feet/s

# Parameters for controlling output
MAKE_FIGURES = False  # Create visualizations
SAVE_HEATMAPS = False
SAVE_BY_SPECIES = False
SAVE_BY_COLLECTED = False
SAVE_SUMMARY_STATISTICS = True
# # # # # # # # # # # # # # # # # #  # # # # # # # # # #


# Load in the data
fish_pos = pd.read_csv(DIREC + FISHPOS_FILE)
release = pd.read_excel(DIREC + PIT_FILE, sheet_name="Release")
collect = pd.read_excel(DIREC + PIT_FILE, sheet_name="Collection")

# Clean collected data
# Only include fish collected where Site Name is "Final Collection Point "
collect = collect[collect["Site Name"] == COLLECTION_POINT]
collect.loc[:, "Detection Time"] = pd.to_datetime(collect["Detection Time"])

# Clean and prep fish position data:
# - get only cases with low MSE
# - only retain movements within a certain speed feet/seconds
# - create abbreviated acoustic tags (atag)

# Get cases with low MSE
fish = fish_pos[fish_pos["MSE"] < MSE_THRESHOLD].copy()
fish.reset_index(drop=True, inplace=True)
fish["Date_time"] = pd.to_datetime(fish["Date_time"])  # SLOW!


# Filter out jumps of more than 7 feet/s
# TODO: This is a bit slow because it isn't vectorized, but it makes sure
# that two bad points in a row are removed, and points after bad points
# are not removed. However, it's not very robust and thus should be improved
# Methods to try: filter based on acceleration or use running median
tag = ""
xprev = 0
ikeep = []
xprev = 0
dprev = pd.Timestamp.min
for i, x in enumerate(fish["X"].tolist()):
    if fish["Tag_code"].iloc[i] != tag:
        ikeep.append(i)
        xprev = fish["X"].iloc[i]
        dprev = fish["Date_time"].iloc[i]
        print(tag)
    else:
        dx = x - xprev
        dt = (fish["Date_time"].iloc[i] - dprev).total_seconds()
        if np.abs(dx / dt) < 7:
            ikeep.append(i)
            xprev = fish["X"].iloc[i]
            dprev = fish["Date_time"].iloc[i]
    tag = fish["Tag_code"].iloc[i]

filtered_fish = fish.iloc[ikeep].reset_index(drop=True)


# Resample by averaging over a given time span.
# TODO: Would prefer a central moving average or running median here
resampled_fish = pd.DataFrame()
for tag, group in filtered_fish.groupby("Tag_code"):
    group = group.sort_values(by="Date_time")
    resampled_group = group.resample(AVERAGING_TIME, on="Date_time").mean(
        numeric_only=True
    )
    resampled_group = resampled_group.reset_index()
    resampled_group["Tag_code"] = tag
    resampled_fish = pd.concat([resampled_fish, resampled_group])

resampled_fish.dropna(subset=["X"], inplace=True)
resampled_fish.reset_index(drop=True, inplace=True)
fish = resampled_fish

# Add abbreviated tag names
fish.loc[:, "atag"] = fish["Tag_code"].str[3:7].str.lower()
atags = fish["atag"].unique()

# Get the accoustic tags corresponding to collected fish and at-large fish
pit_collected = collect["Tag Code"].unique()

# TODO: Use a mapping here
p_to_a, a_to_pit = get_tag_dicts(release["Tag Code"], release["Acoustic Tag"])

atag_collected = [p_to_a[p] for p in pit_collected if p in p_to_a]
atag_atlarge = np.setdiff1d(atags, atag_collected)
fish_collected = fish[fish["atag"].isin(atag_collected)]
fish_atlarge = fish[fish["atag"].isin(atag_atlarge)]

tag_to_species = release.set_index("Acoustic Tag")["Species Name"].to_dict()
if np.nan in tag_to_species:
    tag_to_species.pop(np.nan)

# Reformat the dataframes for output
df_collected = create_df_for_saving(fish_collected, tag_to_species)
df_atlarge = create_df_for_saving(fish_atlarge, tag_to_species)


if SAVE_BY_SPECIES:
    # Save fish by species for collected and at-large fish
    save_file_by_species(df_collected, "collected")
    save_file_by_species(df_atlarge, "atlarge")

if SAVE_BY_COLLECTED:
    df_collected.to_json(FNAME_COLLECTED, orient="split", indent=4)
    df_atlarge.to_json(FNAME_ATLARGE, orient="split", indent=4)

if SAVE_SUMMARY_STATISTICS:

    df = df_collected
    nfish1 = len(df["atag"].unique())
    npts1 = df.describe()["X"]["count"]
    meanlon1 = df.describe()["X"]["mean"]
    meanlat1 = df.describe()["Y"]["mean"]
    meandepth1 = df.describe()["Z"]["mean"]

    df = df_atlarge
    nfish2 = len(df["atag"].unique())
    npts2 = df.describe()["X"]["count"]
    meanlon2 = df.describe()["X"]["mean"]
    meanlat2 = df.describe()["Y"]["mean"]
    meandepth2 = df.describe()["Z"]["mean"]

    df_summary = pd.DataFrame(
        data=[
            ["Collected", nfish1, npts1, meanlat1, meanlon1, meandepth1],
            ["At Large", nfish2, npts2, meanlat2, meanlon2, meandepth2],
        ],
        columns=[
            "Group",
            "Number of Fish",
            "Number of Points",
            "Mean Latitude",
            "Mean Longitude",
            "Mean Depth (m)",
        ],
        dtype=None,
        copy=False,
    )

    df_summary.to_json(FNAME_SUMMARY, orient="split", indent=4)

if SAVE_HEATMAPS:
    # Save heatmaps for collect/at-large to json files
    collectedfile = "collected_hist.json"
    atlargefile = "atlarges_hist.json"

    fname = "collected_histxy.json"
    bins = 40
    norm = True
    data = plt.hist2d(
        fish_collected["X"], fish_collected["Y"], bins=bins, density=norm
    )
    xvals = (data[1][:-1] + data[1][1:]) / 2
    yvals = (data[2][:-1] + data[2][1:]) / 2

    origin = Point(LATITUDE, LONGITUDE)
    dx = xvals[2] - xvals[1]
    lat = distance(miles=dx * FT_TO_MILE).destination(origin, 0).latitude
    lats = [
        distance(miles=x * FT_TO_MILE).destination(origin, 0).latitude
        for x in xvals
    ]
    lons = [
        distance(miles=y * FT_TO_MILE).destination(origin, 90).longitude
        for y in yvals
    ]
    lats = np.array(lats).reshape(-1, 1)

    dat = np.empty((0, 3))
    n = len(lats)
    for i, y in enumerate(lons):
        z = data[0][i, :][:, np.newaxis]
        dat = np.vstack([dat, np.hstack([lats, y * np.ones((n, 1)), z])])
    # Scale intensities to be between 0 and 1
    dat[:, 2] = dat[:, 2] / np.max(dat[:, 2])

    df = pd.DataFrame(dat, columns=["x", "y", "intensity"])
    df.to_json(fname, orient="split", indent=4)


# Quality control plot and visualizations
if MAKE_FIGURES:

    # Plot all fish trajectories by fish
    tags = fish["Tag_code"].unique()
    plt.figure(num=1, clear=True)
    for tag in tags:
        fish0 = fish[fish["Tag_code"] == tag]
        plt.scatter(fish0["X"], fish0["Y"], alpha=0.1, s=0.1)
        plt.pause(0.1)

    # Create 2D plots of fish locations
    # fmt: off
    fig, axes = plt.subplots(num=2, clear=True, nrows=2, ncols=3)
    bins = 40
    norm = True
    axes[0, 0].hist2d(fish_collected["X"], fish_collected["Y"], bins=bins, density=norm)
    axes[0, 1].hist2d(fish_collected["X"], fish_collected["Z"], bins=bins, density=norm)
    axes[0, 2].hist2d(fish_collected["Y"], fish_collected["Z"], bins=bins, density=norm)
    
    axes[1, 0].hist2d(fish_atlarge["X"], fish_atlarge["Y"], bins=bins, density=norm)
    axes[1, 1].hist2d(fish_atlarge["X"], fish_atlarge["Z"], bins=bins, density=norm)
    axes[1, 2].hist2d(fish_atlarge["Y"], fish_atlarge["Z"], bins=bins, density=norm)
    
    for i in range(2):
        axes[i, 0].set_xlabel("X")
        axes[i, 0].set_ylabel("Y")
        axes[i, 1].set_xlabel("X")
        axes[i, 2].set_xlabel("Y")
        for j in range(1,3):
            axes[i, j].set_ylabel('Z')
            axes[i, j].invert_yaxis()
    plt.tight_layout()

    # fmt: on

    # Scatter plots of collected and at-large fish (one plot)
    fig = plt.figure(num=3, clear=True)
    plt.scatter(
        fish_collected["X"], fish_collected["Y"], alpha=0.2, s=0.2, c="blue"
    )
    plt.scatter(
        fish_atlarge["X"], fish_atlarge["Y"], alpha=0.2, s=0.2, c="orange"
    )

    # Scatter plots of collected and at-large fish positions (multiple plots)
    # fmt: off
    fig, axes = plt.subplots(num=4, clear=True, nrows=2, ncols=3)
    for tag in atag_collected:
        fish0 = fish_collected[fish_collected["atag"] == tag]
        axes[0, 0].scatter(fish0["X"], fish0["Y"], alpha=0.1, s=0.1, c="green")
        axes[0, 1].scatter(fish0["X"], fish0["Z"], alpha=0.1, s=0.1, c="orange")
        axes[0, 2].scatter(fish0["Y"], fish0["Z"], alpha=0.1, s=0.1, c="blue")


    for tag in atag_atlarge:
        fish0 = fish_atlarge[fish_atlarge["atag"] == tag]
        axes[1, 0].scatter(fish0["X"], fish0["Y"], alpha=0.1, s=0.1, c="green")
        axes[1, 1].scatter(fish0["X"], fish0["Z"], alpha=0.1, s=0.1, c="orange")
        axes[1, 2].scatter(fish0["Y"], fish0["Z"], alpha=0.1, s=0.1, c="blue")

    for i in range(2):
        axes[i, 0].set_xlabel("X")
        axes[i, 0].set_ylabel("Y")
        axes[i, 1].set_xlabel("X")
        axes[i, 2].set_xlabel("Y")
        for j in range(1,3):
            axes[i, j].set_ylabel('Z')
            axes[i, j].invert_yaxis()
    plt.tight_layout()
    # fmt: on

    # Plot all the ending points for collected fish
    plt.figure(num=5, clear=True)
    for tag, pit_tag in zip(atag_collected, pit_collected):
        fish0 = fish_collected[fish_collected["atag"] == tag]
        if len(fish0) > 0:
            plt.plot(fish0["X"].iloc[-1], fish0["Y"].iloc[-1], ".")

    # Plot collection data vs final position
    plt.figure(num=6, clear=True)
    for tag, pit_tag in zip(atag_collected, pit_collected):
        fish0 = fish_collected[fish_collected["atag"] == tag]
        det_time = collect[collect["Tag Code"] == pit_tag]["Detection Time"]
        if len(fish0) > 0:
            plt.plot(fish0["Date_time"].iloc[-1], det_time, ".")

    minx = fish["Date_time"].min()
    maxx = fish["Date_time"].max()
    plt.figure(5)
    plt.plot([minx, maxx], [minx, maxx])
    plt.xlabel("Date final position recorded")
    plt.ylabel("Collection Date")
    plt.tight_layout()

    # Create hists for the at-large fish and the collected fish
    fig, axes = plt.subplots(num=7, clear=True, nrows=2, ncols=3)
    fish_collected["X"].hist(ax=axes[0, 0])
    fish_collected["Y"].hist(ax=axes[0, 1])
    fish_collected["Z"].hist(ax=axes[0, 2])
    fish_atlarge["X"].hist(ax=axes[1, 0])
    fish_atlarge["Y"].hist(ax=axes[1, 1])
    fish_atlarge["Z"].hist(ax=axes[1, 2])
    axes[0, 0].set_title("X")
    axes[0, 1].set_title("Y")
    axes[0, 2].set_title("Z")
    plt.tight_layout()
