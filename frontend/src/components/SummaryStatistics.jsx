import summary_statistics from "../data/summary_statistics.json";

function SummaryStatistics() {
    return (
        <div className="table-container">
            <h2>Summary Statistics</h2>
            <table>
                <thead>
                    <tr>
                        {summary_statistics.columns.map((column, index) => (
                            <th key={index}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {summary_statistics.data.map((row, index) => (
                        <tr key={index}>
                            <td>{row[0]}</td>
                            <td>{row[1]}</td>
                            <td>{row[2]}</td>
                            <td>{row[3].toFixed(5)}</td>
                            <td>{row[4].toFixed(5)}</td>
                            <td>{row[5].toFixed(1)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SummaryStatistics;