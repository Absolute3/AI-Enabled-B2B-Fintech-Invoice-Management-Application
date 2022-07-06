import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export default function Arrow({order}) {
    if (order == "ASC") {
        return <ArrowDownwardIcon />
    } else {
        return <ArrowUpwardIcon />
    }
}