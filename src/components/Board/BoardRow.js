import {LinkContainer} from "react-router-bootstrap";
import {Button} from "react-bootstrap";
import {FaEdit, FaExternalLinkAlt, FaTrash} from "react-icons/fa";
import DeleteBoardModal from "./DeleteBoardModal";
import {useState} from "react";


const BoardRow = (props) => {

    const [deleteBoardModalShow, setDeleteBoardModalShow] = useState(false);

    return (
        <>
            <tr key={props.board.id}>
                <td>
                    {props.board.name}
                </td>
                <td className={'d-flex justify-content-evenly'}>
                    <LinkContainer to={`/boards/${props.board.name}`}>
                        <Button variant={"success"}><FaExternalLinkAlt/></Button>
                    </LinkContainer>
                    <LinkContainer to={`#`}>
                        <Button disabled variant={"warning"}><FaEdit/></Button>
                    </LinkContainer>
                    <Button variant={"danger"} onClick={() => setDeleteBoardModalShow(true)}>
                        <FaTrash/>
                    </Button>
                </td>
            </tr>

            <DeleteBoardModal
                board={props.board}
                show={deleteBoardModalShow}
                onHide={() => setDeleteBoardModalShow(false)}
                rerender={props.rerender}
            />
        </>
    )
}

export default BoardRow;