import {Button, Card} from "react-bootstrap";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "../../db";
import CardModal from "./CardModal";
import {useState} from "react";
import ArchivedCardModal from "./ArchivedCardModal";
import {GrTextAlignFull} from "react-icons/gr";

const CardCard = (props) => {

    const [showCardModal, setShowCardModal] = useState(false);

    const user = useLiveQuery(() =>
        db.users.where({id: props.card.user_id}).first()
    )

    return (
        <>
            <Card className={props.className}>
                <Card.Header className={'d-flex justify-content-between align-items-center flex-wrap'}>
                    {props.card.title}
                    <Button
                        className={'description'}
                        variant={'outline-secondary'}
                        size={'sm'}
                        onClick={() => setShowCardModal(true)}
                    >
                        <GrTextAlignFull/>
                    </Button>
                </Card.Header>

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