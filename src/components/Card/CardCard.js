import {Button, Card} from "react-bootstrap";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../db";
import {FaExternalLinkAlt} from "react-icons/fa";
import CardModal from "./CardModal";
import {useState} from "react";
import ArchivedCardModal from "./ArchivedCardModal";

const CardCard = (props) => {

    const [showCardModal, setShowCardModal] = useState(false);

    const user = useLiveQuery(() =>
        db.users.where({id: props.card.user_id}).first()
    )

    return (
        <>
            <Card className={props.className}>
                <Card.Header className={'d-flex justify-content-between'}>
                    {props.card.title}
                    <Button
                        variant={'outline-primary'}
                        size={'sm'}
                        onClick={() => setShowCardModal(true)}
                    >
                        <FaExternalLinkAlt/>
                    </Button>
                </Card.Header>
                <Card.Body>
                    {props.card.description}
                </Card.Body>
                <Card.Footer>
                    {user?.username}
                </Card.Footer>
            </Card>

            {
                props.archived
                    ?
                    <ArchivedCardModal
                        card={props.card}
                        show={showCardModal}
                        onHide={() => setShowCardModal(false)}
                        rerender={props.rerender}
                        rerenderBoard={props.rerenderBoard}
                    />
                    :
                    <CardModal
                        card={props.card}
                        show={showCardModal}
                        onHide={() => setShowCardModal(false)}
                        rerender={props.rerender}
                        rerenderBoard={props.rerenderBoard}
                    />
            }

        </>
    )
}

export default CardCard;