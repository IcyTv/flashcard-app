import { IonButton } from "@ionic/react";
import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";
import "./FlashCard.scss";

interface FlashCardProps {
	front: string;
	back: string;
	slot?: string;
	hidden?: boolean;
	onContinue: (correct: boolean, ev?: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) => void;
}

export const FlashCard: React.FC<FlashCardProps> = (props) => {
	const [flipped, setFlipped] = useState(false);
	const [showNew, setShowNew] = useState(false);

	const onClick = (correct: boolean) => (ev: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) => {
		props.onContinue(correct, ev);
	};

	return (
		<div slot={props.slot} className="flashcard" hidden={props.hidden}>
			<ReactCardFlip infinite isFlipped={flipped}>
				<IonButton
					onClick={() => {
						setFlipped(!flipped);
						setShowNew(true);
					}}
				>
					{props.front}
				</IonButton>
				<IonButton onClick={() => setFlipped(!flipped)}>{props.back}</IonButton>
			</ReactCardFlip>
			{showNew && [
				<IonButton key="submit-wrong" onClick={onClick(false)}>
					Wrong
				</IonButton>,
				<IonButton key="submit-right" onClick={onClick(true)}>
					Right
				</IonButton>,
			]}
		</div>
	);
};
