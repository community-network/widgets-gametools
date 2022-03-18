import styled from "styled-components";

interface IZoom {
  zoom: string;
}

export const Main = styled.a<IZoom>`
  position: fixed;
  text-decoration: none;
  width: 100%;
  height: 100%;
  zoom: ${(props) => props.zoom}%;
`;

export const Row = styled.div`
  /* flex: 1; */
  margin-right: 0.5rem;
`;

export const Title = styled.h4`
  margin: 0;
  margin-right: 5rem;
  font-family: Futura PT;
  font-style: normal;
  font-weight: 600;
  font-size: 34px;
  line-height: 44px;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.67);
`;

export const Description = styled.p`
  margin: 0;
  margin-right: 5rem;
  margin-bottom: 3rem;
  font-family: Futura PT;
  font-style: normal;
  font-weight: bold;
  font-size: 38px;
  line-height: 49px;
  display: flex;
  align-items: center;

  color: rgba(255, 255, 255, 0.92);
`;
