import {Card} from "react-bootstrap";
import BoardCardButtons from "./BoardCardButtons";


const BoardsTable = (props) => {


    return (
        <>
            {props.boards?.map(board => (
                <>
                    <Card className={props.className + ' text-light mb-4 text-center'}>
                        <Card.Header className={'fw-bold bg-dark'}>
                            {board.name}
                        </Card.Header>
                        <Card.Body className={'d-flex justify-content-around'}>
                            <BoardCardButtons key={board.id} board={board} rerender={props.rerender}></BoardCardButtons>
                        </Card.Body>
                    </Card>
                </>
            ))}
        </>
    )

}

export default BoardsTable;