import {Table} from "react-bootstrap";
import BoardRow from "./BoardRow";

const BoardsTable = (props) => {

    return (
        <>
            <Table striped borderless hover variant={'primary'} className={'text-center shadow-mine rounded-mine'}>
                <thead>
                <tr>
                    <th>Board</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {props.boards?.map(board => (
                    <BoardRow
                        key={board.id}
                        board={board}
                        rerender={props.rerender}
                    />
                ))}
                </tbody>
            </Table>
        </>
    )

}

export default BoardsTable;