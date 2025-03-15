import React from "react";
import summary_statistics from "../data/summary_statistics.json";

interface SummaryStatsData {
    columns: string[];
    data: (string | number)[][];
}

const summaryStatistics: SummaryStatsData = summary_statistics;

function SummaryStatistics() {
    return (
        <div className="table-container">
            <h2>Summary Statistics</h2>
            <table>
                <thead>
                    <tr>
                        {summary_statistics.columns.map((column:string, index:number) => (
                            <th key={index}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {summary_statistics.data.map((row: (string|number)[], index:number) => (
                        <tr key={index}>
                            <td>{row[0]}</td>
                            <td>{row[1]}</td>
                            <td>{row[2]}</td>
                            <td>{typeof row[3] === 'number' ? row[3].toFixed(5) : row[3]}</td>
                            <td>{typeof row[4] === 'number' ? row[4].toFixed(5) : row[4]}</td>
                            <td>{typeof row[5] === 'number' ? row[5].toFixed(1) : row[5]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SummaryStatistics;