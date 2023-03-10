USE [Hasty]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Delete_ById]    Script Date: 03/07/23 13:12:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: <Doupis>
-- Create date: <01-25-2023T17:15:00>
-- Description: Messages Delete ById
-- Code Reviewer: Mariana Hernandez

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE PROC[dbo].[Messages_Delete_ById]
		@Id int

/*---Test Code---

	DECLARE @Id int = 4

	SELECT *
	FROM [dbo].[Messages]
	WHERE [Id] = @Id

	EXECUTE [dbo].[Messages_Delete_ById]
		@Id
	
	SELECT *
	FROM [dbo].[Messages]
	WHERE [Id] = @Id

	SELECT*
	FROM [dbo].[Messages]
	ORDER BY Id

*/

AS

BEGIN

	DELETE FROM [dbo].[Messages]
	WHERE Id = @Id

END
GO
