import {LinkContainer} from "react-router-bootstrap";
import {Button} from "react-bootstrap";
import { FaExternalLinkAlt, FaTrash} from "react-icons/fa";
import DeleteBoardModal from "./DeleteBoardModal";
import {useState} from "react";


const BoardCardButtons = (props) => {

    const [deleteBoardModalShow, setDeleteBoardModalShow] = useState(false);

    return (
        <>
                    <LinkContainer to={`/boards/${props.board.name}`}>
                        <Button variant={"success"}><FaExternalLinkAlt/></Button>
                    </LinkContainer>
                    <Button variant={"danger"} onClick={() => setDeleteBoardModalShow(true)}>
                        <FaTrash/>
                    </Button>


            <DeleteBoardModal
                board={props.board}
                show={deleteBoardModalShow}
                onHide={() => setDeleteBoardModalShow(false)}
                rerender={props.rerender}
            />
        </>
    )
}

export default BoardCardButtons;